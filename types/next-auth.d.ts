// types/next-auth.d.ts

import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    userType: string;
    name: string;
    email: string;
    token: string;
  }
  interface Session {
    user: {
      id: string;
      userType: string;
      name: string;
      email: string;
      jwtToken: string;
      image: string | null;
      picture: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    userType: string;
    accessToken: string;
  }
}
