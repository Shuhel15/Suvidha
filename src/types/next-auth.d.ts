import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    accountType: "CUSTOMER" | "BUSINESS_OWNER";
  }

  interface Session {
    user: {
      id: string;
      accountType: "CUSTOMER" | "BUSINESS_OWNER";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accountType?: "CUSTOMER" | "BUSINESS_OWNER";
  }
}
