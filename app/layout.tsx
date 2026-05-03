import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage-grotesque"
});

export const metadata: Metadata = {
  title: "Paylance",
  description: "Monetization platform for creators."
};

import { AuthGuard } from "@/components/auth/auth-guard";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                const savedTheme = localStorage.getItem("theme") || "dark";
                document.documentElement.setAttribute("data-theme", savedTheme);
              })();
            `
          }}
        />
      </head>
      <body className={bricolageGrotesque.variable}>
        {children}
      </body>
    </html>
  );
}
