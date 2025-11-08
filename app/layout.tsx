import AnimatedHeader from "@/components/AnimatedHeader";
import "./globals.css";

export const metadata = {
  title: "Photo AI",
  description: "Upload, analyze, and search your photos intelligently",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <AnimatedHeader />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
