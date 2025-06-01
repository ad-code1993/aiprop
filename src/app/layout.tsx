// app/layout.tsx
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Proposal Generator",
  description: "Generate proposals interactively with AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen w-screen bg-background text-foreground",
          inter.className
        )}
      >
        <div className="flex flex-col h-full w-full overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
