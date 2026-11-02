import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { generateOTP, hashOTP } from "@/lib/otp";
import { redis } from "@/lib/redis";
import { sendOTPEmail } from "@/lib/mailer";

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name is required")
    .max(100)
    .regex(/^[A-Za-z]+(?:\s+[A-Za-z]+)*$/, "Enter a valid name"), 
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((email) => email.toLowerCase()),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
 password: z
    .string()
    .min(6)
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
  accountType: z.enum(["CUSTOMER", "BUSINESS_OWNER"]).default("CUSTOMER"),
});

export async function POST(req: Request) {

  let createdUserId: string | undefined;
  let otpKey:string | undefined;
  let attemptsKey: string | undefined;

  try {
    const body = await req.json();

    //Validate the request body against the schema
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.error.issues[0].message,
        },
        { status: 400 },
      );
    }

    const { name, email, phone, password, accountType } = result.data;

    //Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already registered",
        },
        { status: 409 },
      );
    }

    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    //Generate OTP
    const otp = generateOTP()
    const hashedOtp = hashOTP(email, otp)

    const encodedEmail = encodeURIComponent(email);

    otpKey = `suvidha:otp:${encodedEmail}`
    attemptsKey = `suvidha:otp-attempts:${encodedEmail}`

    //Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        accountType,
        emailVerified: false,
      },
    });

    createdUserId = user.id;

    //Store hashed OTP in Redis for 5 min
    await redis.set(otpKey, hashedOtp, "EX", 300)

    // Track Attempts
    await redis.set(attemptsKey, 0, "EX", 300)

    //Send OTP email
    await sendOTPEmail(email, otp);

    //Set temporary pending email cookie
    const response = NextResponse.json(
      {
        success: true,
        message:"OTP sent successfully. Please verify your email.",
      
      },
      { status: 201 },
    )

    response.cookies.set("pending_email", email,{
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:"lax",
      path:"/",
      maxAge:300
    })

    return response;

  } catch (error) {
    console.log("Error in register route:", error);

    //Cleanup if registration fails
    const cleanupTasks =[];

    if(createdUserId){
      cleanupTasks.push(
        prisma.user.deleteMany({
          where:{id: createdUserId, emailVerified:false},
        })
      )
    }

    if(otpKey)cleanupTasks.push(redis.del(otpKey))
    if(attemptsKey)cleanupTasks.push(redis.del(attemptsKey))

    await Promise.allSettled(cleanupTasks)

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
