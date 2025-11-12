export interface UploadSampleConfig {
  name: string;
  href: string
  video: string;
}

export const UploadSampleConfig: UploadSampleConfig[] = [
  {
    name: "Soul Painter",
    href: "/demo1.jpeg",
    video: "https://mlzyxmndtertlwqbqfjr.supabase.co/storage/v1/object/public/funny-video-public-store/demo1.mp4",
  }
];