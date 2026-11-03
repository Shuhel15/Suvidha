import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { hashOTP } from "@/lib/otp";
import { z } from "zod";
import { timingSafeEqual } from "crypto";


const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit OTP"),
});

export async function POST(req: Request) {
  try {
    //Get pending email from cookies
    const cookieStore = await cookies();
    const email = cookieStore.get("pending_email")?.value;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Session expired. Please register again.",
        },
        { status: 400 },
      );
    }

    //Validate Req body
    const body = await req.json();
    const result = otpSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.error.issues[0].message,
        },
        { status: 400 },
      );
    }

    const { otp } = result.data;

    //Redis keys for OTP and attempts
    const encodedEmail = encodeURIComponent(email);
    const otpKey = `suvidha:otp:${encodedEmail}`;
    const attemptsKey = `suvidha:otp_attempts:${encodedEmail}`;

    //Check attempts
    const attempts = Number((await redis.get(attemptsKey)) ?? 0);

    if (attempts >= 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many attempts exceeded. Please register again.",
        },
        { status: 429 },
      );
    }

    //Get stored OTP hash
    const storedHash = await redis.get(otpKey);
    if (!storedHash) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP expired. Please register again.",
        },
        { status: 400 },
      );
    }

    //Generate hash of provided OTP
    const enteredHash = hashOTP(email, otp);
    const isValid = timingSafeEqual(
      Buffer.from(storedHash, "hex"),
      Buffer.from(enteredHash, "hex"),
    );

    //Handle incorrect OTP
    if (!isValid) {
      const newAttempts = await redis.incr(attemptsKey);

      if (newAttempts === 1) {
        await redis.expire(attemptsKey, 300);
      }

      return NextResponse.json(
        {
          success: false,
          message: `Incorrect OTP. You have ${5 - newAttempts} attempts left.`,
        },
        { status: 400 },
      );
    }

    //Verify user in db
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found. Please register again.",
        },
        { status: 404 },
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already verified. Please login.",
        },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    })

    //Delete OTP data from redis
    await redis.del(otpKey, attemptsKey);

    //Clear pending email cookie
    const response = NextResponse.json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    },{status: 200})

    response.cookies.set("pending_email","",{
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })

    return response;
  } catch (error) {
    console.log("Error in verify-otp route:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again later.",
      },
      { status: 500 },
    );
  }
}
