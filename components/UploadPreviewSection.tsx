"use client";

import { UserUsage } from "@/types/user";
import { UploadPreviewCard } from "./UploadPreviewCard";

interface UploadPreviewSectionProps {
  userUsage: UserUsage | null;
  selectedImageIndex?: number;
}

export default function UploadPreviewSection({ userUsage, selectedImageIndex }: UploadPreviewSectionProps) {
  return (
    <div>
      {/* 上传预览组件 */}
      <UploadPreviewCard userUsage={userUsage} selectedImageIndex={selectedImageIndex} />
    </div>
  )
}