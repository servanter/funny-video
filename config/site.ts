import { SiteConfig } from "@/types/siteConfig"

const baseSiteConfig = {
  name: "Funny Video For Free",
  description:
    "Create funny and viral short videos with AI style transfer. Transform any video into soul painting style in seconds. Free online tool for TikTok, Instagram, and social media.",
  url: "https://www.funny-video.top",
  ogImage: "https://www.funny-video.top/og.png",
  metadataBase: new URL("https://www.funny-video.top"),
  keywords: ["funny video", "AI video maker", "video style transfer", "soul painting video", "short video creator", "TikTok video maker", "AI video effects", "free video tool"],
  authors: [
    {
      name: "servanter",
      url: "https://www.funny-video.top",
    }
  ],
  creator: '@servanter',
  themeColor: '#fff',
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  links: {
    twitter: "https://x.com/hongyanzha38268",
    github: "https://github.com/servanter",
  },
}

export const siteConfig: SiteConfig = {
  ...baseSiteConfig,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseSiteConfig.url,
    title: baseSiteConfig.name,
    description: baseSiteConfig.description,
    siteName: baseSiteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: baseSiteConfig.name,
    description: baseSiteConfig.description,
    images: [`${baseSiteConfig.url}/og.png`],
    creator: baseSiteConfig.creator,
  },
}
