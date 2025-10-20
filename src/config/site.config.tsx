import { Metadata } from "next";
import { LAYOUT_OPTIONS } from "@/config/enums";
import { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";

enum MODE {
  DARK = "dark",
  LIGHT = "light",
}

export const siteConfig = {
  title: "LinguaTech - Quản lý dự án ngôn ngữ",
  description: "Nền tảng LinguaTech hỗ trợ quản lý và theo dõi các dự án ngôn ngữ, dịch thuật và phát triển công nghệ ngôn ngữ một cách hiệu quả",
  // logo: logoImg,
  // icon: logoIconImg,
  mode: MODE.LIGHT,
  layout: LAYOUT_OPTIONS.HYDROGEN,
  // TODO: favicon
};

export const metaObject = (
  title?: string,
  openGraph?: OpenGraph,
  description: string = siteConfig.description
): Metadata => {
  return {
    title: title ? `${title} - LinguaTech` : siteConfig.title,
    description,
    openGraph: openGraph ?? {
      title: title ? `${title} - LinguaTech` : title,
      description,
      url: "https://linguatech.vn",
      siteName: "LinguaTech", // https://developers.google.com/search/docs/appearance/site-names
      images: {
        url: "https://linguatech.vn/images/ltlogo.png",
        width: 1200,
        height: 630,
      },
      locale: "en_US",
      type: "website",
    },
  };
};
