//auth.config.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { signInSchema } from "./lib/zod";
import prisma from "@/db/index";
import bcryptjs from "bcryptjs";
import { JWTPayload, SignJWT, importJWK } from "jose";
import { randomUUID } from "crypto";
import type { Adapter } from "next-auth/adapters";
import { SessionStrategy } from "next-auth";

const generateJWT = async (payload: JWTPayload) => {
  const secret = process.env.JWT_SECRET;

  const jwk = await importJWK({ k: secret, alg: "HS256", kty: "oct" });

  const jwt = await new SignJWT({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    jti: randomUUID(), // Adding a unique jti to ensure each token is unique. This helps generate a unique jwtToken on every login
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("365d")
    .sign(jwk);

  return jwt;
};

const getCookieDomain = () => {
  if (process.env.NODE_ENV === "production") {
    const url = process.env.NEXTAUTH_URL;
    if (url) {
      try {
        const domain = new URL(url).hostname;
        // For subdomains like printlly-user-frontend.vercel.app, use the main domain
        const parts = domain.split(".");
        if (parts.length > 2 && parts[parts.length - 2] === "vercel") {
          return `.${parts.slice(-3).join(".")}`;
        }
        return `.${parts.slice(-2).join(".")}`;
      } catch (e) {
        console.error("Error parsing NEXTAUTH_URL for domain:", e);
      }
    }
  }
  return undefined;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
      // pkce: true,
      // checks: ["none"],
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "email", type: "text", placeholder: "" },
        password: { label: "password", type: "password", placeholder: "" },
      },

      async authorize(credentials: any) {
        try {
          if (!credentials) return null;

          // Validate credentials
          const parsedCredentials = signInSchema.safeParse(credentials);

          if (!parsedCredentials.success) {
            console.error(
              "Invalid credentials:",
              parsedCredentials.error.errors
            );
            return null;
          }

          // Get user from the database
          const userDb = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
            select: {
              password: true,
              id: true,
              name: true,
              image: true,
              email: true,
              userType: true,
            },
          });

          if (!userDb || !userDb.password) {
            console.log("Invalid credentials");
            return null;
          }

          const isPasswordValid = await bcryptjs.compare(
            credentials.password,
            userDb.password
          );

          if (!isPasswordValid) {
            console.log("Invalid password");
            return null;
          }

          const jwt = await generateJWT({
            id: userDb.id,
            email: userDb.email,
            name: userDb.name,
          });

          await prisma.user.update({
            where: {
              id: userDb.id,
            },
            data: {
              token: jwt,
            },
          });

          return {
            id: userDb.id,
            name: userDb.name,
            email: credentials.email,
            image: userDb.image,
            // emailVerified: userDb.emailVerified,
            userType: userDb.userType || "Student",
            token: jwt,
          };
        } catch (e) {
          console.error(e);
        }
        return null;
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET!,

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "none" as const,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: getCookieDomain(),
      },
    },
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            const result = await prisma.$transaction(async (tx) => {
              const newUser = await tx.user.create({
                data: {
                  email: user.email!,
                  name: user.name,
                  image: user.image,
                  userType: "Student",
                  isEmailVerified: true,
                  emailVerified: new Date(),
                },
              });

              const token = await generateJWT({
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
              });

              await tx.user.update({
                where: { id: newUser.id },
                data: { token },
              });

              return newUser;
            });

            await prisma.account.create({
              data: {
                userId: result.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            });

            user.id = result.id;
            user.userType = result.userType;
          } else {
            user.id = existingUser.id;
            user.userType = existingUser.userType;

            // const existingAccount = await prisma.account.findUnique({
            //   where: {
            //     provider_providerAccountId: {
            //       provider: account.provider,
            //       providerAccountId: account.providerAccountId,
            //     },
            //   },
            // });

            // if (!existingAccount) {
            //   await prisma.account.create({
            //     data: {
            //       userId: existingUser.id,
            //       type: account.type,
            //       provider: account.provider,
            //       providerAccountId: account.providerAccountId,
            //       refresh_token: account.refresh_token,
            //       access_token: account.access_token,
            //       expires_at: account.expires_at,
            //       token_type: account.token_type,
            //       scope: account.scope,
            //       id_token: account.id_token,
            //       session_state: account.session_state,
            //     },
            //   });
            // }
          }
        } catch (error) {
          console.error("Error during OAuth sign in:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, trigger, session, account }) {
      if (user) {
        token.id = user.id;
        token.userType = user.userType || "User";
        token.name = user.name;
        token.email = user.email;

        // For credentials provider, user.token contains the JWT
        if (user.token) {
          token.jwtToken = user.token;
        }

        // For OAuth providers, generate or retrieve JWT
        if (account?.provider === "github" || account?.provider === "google") {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { id: user.id },
              select: { token: true, userType: true },
            });

            if (dbUser?.token) {
              token.jwtToken = dbUser.token;
              token.userType = dbUser.userType || "User";
            } else {
              // Generate new JWT if not exists
              const newJwt = await generateJWT({
                id: user.id,
                email: user.email,
                name: user.name,
              });

              await prisma.user.update({
                where: { id: user.id },
                data: { token: newJwt },
              });

              token.jwtToken = newJwt;
            }
          } catch (error) {
            console.error("Error handling OAuth JWT:", error);
          }
        }
      }

      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      return token;
    },

    async session({ session, token }) {
      console.log("🚀 -> auth.config.ts:301 -> session:", session);
      console.log("🚀 -> auth.config.ts:302 -> token:", token);
      if (session.user && token) {
        try {
          session.user.id = token.id;
          session.user.userType = token.userType;
          session.user.name = token.name;
          session.user.email = token.email;
          session.user.jwtToken = token.jwtToken as string;

          // Debug logging
          // console.log("Updated Session:", session);
        } catch (error) {
          console.error("Error encoding token:", error);
          session.user = token as any;
        }
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;

      // Default redirect
      return baseUrl;
    },
  },
};

// hsingh's code from cms
// interface RateLimiter {
//   timestamps: Date[];
// }
// const userRateLimits = new Map<string, RateLimiter>();

// export const rateLimit = (
//   userId: string,
//   rateLimitCount: number,
//   rateLimitInterval: number
// ): boolean => {
//   const now = new Date();
//   const userLimiter = userRateLimits.get(userId) ?? { timestamps: [] };

//   userLimiter.timestamps = userLimiter.timestamps.filter(
//     (timestamp) => now.getTime() - timestamp.getTime() < rateLimitInterval
//   );

//   if (userLimiter.timestamps.length >= rateLimitCount) {
//     return false; // Rate limit exceeded
//   }

//   userLimiter.timestamps.push(now);
//   userRateLimits.set(userId, userLimiter);
//   return true;
// };
