import { ONE_DAY } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { boostPack } from "@/lib/usage/usage";
import { getUserUsage } from "@/lib/user/action";
import { Account, NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import redis from "./redis";


export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    signOut: '/auth/logout',
  },
  providers: [
    GithubProvider({
      clientId: `${process.env.GITHUB_ID}`,
      clientSecret: `${process.env.GITHUB_SECRET}`,
      httpOptions: {
        timeout: 50000,
      },
    }),
    GoogleProvider({
      clientId: `${process.env.GOOGLE_ID}`,
      clientSecret: `${process.env.GOOGLE_SECRET}`
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // 登录(account仅登录那一次有值)
      // Only on sign in (account only has a value at that time)
      console.log('JWT callback - account:', account);
      console.log('JWT callback - token:', token);
      if (account) {
        token.accessToken = account.access_token

        // 存储访问令牌
        // Store the access token
        await storeAccessToken(account.access_token || '', token.sub);

        // 先查询是否存在该用户，用于判断首次注册
        const existing = await prisma.user.findUnique({ where: { userId: token.sub as string } });
        console.log('Existing user:', existing);

        // 用户信息存入数据库
        // Save user information in the database
        const userInfo = await upsertUserAndGetInfo(token, account);
        if (!userInfo || !userInfo.userId) {
          throw new Error('User information could not be saved or retrieved.');
        }
        if (!existing) {
          const userId = userInfo.userId;
          await boostPack({ userId: userId });
        }

        const dbUser = await getUserUsage(userInfo.userId)
        const fullUserInfo = {
          userId: userInfo.userId,
          username: userInfo.username,
          avatar: userInfo.avatar,
          email: userInfo.email,
          platform: userInfo.platform,
          role: dbUser.role,
          membershipExpire: dbUser.membershipExpire,
          accessToken: account.access_token
        }
        return fullUserInfo
      }
      return token as any
    },
    async session({ session, token }) {
      // Append user information to the session
      if (token && token.userId) {
        const dbUser = await getUserUsage(token.userId as string)
        const user = {
          userId: token.userId,
          username: token.username,
          avatar: token.avatar,
          email: token.email,
          platform: token.platform,
          role: dbUser.role,
          membershipExpire: dbUser.membershipExpire,
          accessToken: token.accessToken
        }
        session.user = user
      }
      return session;
    }
  },
}
async function storeAccessToken(accessToken: string, sub?: string) {
  if (!accessToken || !sub) return;
  const expire = ONE_DAY * 30; // The number of seconds in 30 days
  await redis.set(accessToken, sub, { ex: expire });
}

async function upsertUserAndGetInfo(token: JWT, account: Account) {
  const user = await upsertUser(token, account.provider);
  if (!user || !user.userId) return null;

  const dbUser = await getUserUsage(user.userId)

  return {
    ...user,
    role: dbUser.role,
    membershipExpire: dbUser.membershipExpire,
  };
}
async function upsertUser(token: JWT, provider: string) {
  const userData = {
    userId: token.sub,
    username: token.name,
    avatar: token.picture,
    email: token.email,
    platform: provider,
  };

  const user = await prisma.user.upsert({
    where: { userId: token.sub },
    update: userData,
    create: { ...userData, role: 0 },
  });

  return user || null;
}