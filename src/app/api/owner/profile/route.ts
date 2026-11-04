import {NextResponse} from "next/server";
import {requireRole} from "@/lib/auth-guard";

export async function GET(){
  try{
    const { session, response} = await requireRole("BUSINESS_OWNER")

    //Authentication or Authorization failed
    if(response) return response

    return NextResponse.json({
      success: true,
      message:"Owner authorized successfully",
      user:{
        id:session!.user.id,
        email:session!.user.email,
        accountType:session!.user.accountType
      },
      
    },{status:200})



  }catch(error){
    console.error("Owner profile API error", error)

    return NextResponse.json({
      success: false,
      message:"Internal server error"
    },
    {status:500})
  }
}