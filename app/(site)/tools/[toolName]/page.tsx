
import ImageComparisonSlider from "@/components/ImageComparisonSlider";
import UploadPreviewSection from "@/components/UploadPreviewSection";
import { imageConfigs } from "@/config/DescriptionConfig";
import { getCurrentUser } from "@/lib/session";
import { getUserUsage } from "@/lib/user/action";
import { UserInfo } from "@/types/user";
import { notFound } from "next/navigation";

interface ToolPageProps {
  params: {
    toolName: string;
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  // 根据 toolName 匹配配置
  const config = imageConfigs.find(
    (item) => item.link === params.toolName
  );

  if (!config) {
    return notFound(); // 未匹配到配置时返回 404
  }

  const user = (await getCurrentUser()) as UserInfo;
  let userUsage = null;

  if (user) {
    userUsage = await getUserUsage(user.userId)
  }


  return (
    <>
      <div className="flex max-full mx-auto flex-col justify-center py-0 px-4">
        <div className="flex flex-1 w-full flex-col items-center justify-center text-center">
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

          <ImageComparisonSlider config={config} />

          <UploadPreviewSection userUsage={userUsage} selectedImageIndex={config.type - 1} />
        </div>
      </div>

    </>
  );
}