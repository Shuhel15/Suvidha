import {auth} from "@/auth"
import {NextResponse} from "next/server"

type AccountRole = "CUSTOMER"|"BUSINESS_OWNER"

export async function requireAuth(){
  const session = await  auth()

  //If user is logged in
  if(!session?.user){
    return{
      session: null,
      response: NextResponse.json({
        success: false,
        message: "Unauthorized. Please log in first.",
      },
      {status: 401}
    )
    }
  }
  return{
    session,
    response: null
  }

}

export async function requireRole(role: AccountRole){
  const {session, response} = await requireAuth()

  //Auth failed
  if(response){
    return {session: null, response}
  }

  //Role auth failed
  if(session?.user.accountType !== role){
    return{
      session: null,
      response: NextResponse.json({
        success: false,
        message:"Forbidden. You don't have permission."
      },
      {status: 403}
    )
    }
  }
  return{
    session,
    response: null
  }
}