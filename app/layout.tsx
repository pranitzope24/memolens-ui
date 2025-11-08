import AnimatedHeader from "@/components/AnimatedHeader";
import "./globals.css";

export const metadata = {
  title: {
    default: "MemoLens",
    template: "%s - MemoLens",
  },
  description: "Upload, analyze, and search your photos intelligently",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icons/icon-192x192.png", sizes: "192x192" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icons/safari-pinned-tab.svg",
        color: "#3b82f6",
      },
    ],
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  appleWebApp: {
    title: "MemoLens",
    statusBarStyle: "default",
    capable: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <div className="flex flex-col min-h-screen bg-white">
          <AnimatedHeader />
          <main className="flex-1 relative bg-white">{children}</main>
        </div>
      </body>
    </html>
  );
}
