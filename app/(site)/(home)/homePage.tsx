"use client";

import Features from "@/components/Features";
import HowToUse from "@/components/HowToUse";
import Subscribe from "@/components/subscribe/Subscribe";
import TestimonialCarousel from "@/components/testimonials/TestimonialCarousel";
import { UploadPreviewCard } from "@/components/UploadPreviewCard";
import { UserInfo, UserUsage } from "@/types/user";
import { Toaster } from "react-hot-toast";

interface HomePageProps {
  user: UserInfo | null;
  userUsage: UserUsage | null
}

export default function HomePage({
  user,
  userUsage
}: HomePageProps) {

  return (
    <>
      <h1 className="text-6xl font-bold mt-20">
        <span className="custom-underline relative">AImage</span>
      </h1>

      <div className="mx-auto mb-[1.275rem] w-full max-w-[580px] text-lg tracking-[-0.2px] dark:text-gray-500 mt-8">
        <div className="relative mx-auto flex max-w-fit items-center justify-center rounded-[1.25rem] font-medium bg-transparent !important transition-shadow duration-500 overflow-hidden cursor-pointer">
          <div className="relative z-2 text-transparent bg-gradient-to-r from-[#40ffa2] via-[#4079ff] to-[#40ffa2] bg-[size:300%_100%] bg-clip-text animate-gradient">
            Generate funny videos in seconds with AI — free, no sign-up required!
          </div>
        </div>
      </div>

      {/* 上传预览组件 */}
      <UploadPreviewCard userUsage={userUsage} />

      {/* 用户评价轮播图 */}
      <TestimonialCarousel />

      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 2000 }}
      />
      <hr className="h-px bg-gray-700 border-1" />

      <Features />

      <HowToUse />

      <Subscribe user={user} />
    </>
  );
}