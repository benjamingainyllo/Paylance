import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage-grotesque"
});

const SITE_DESCRIPTION =
  "Share one link for your event. Guests pay by card or transfer, you see who's coming and who's paid, and the money lands straight in your bank account.";

export const metadata: Metadata = {
  title: {
    default: "Paylance — Stop chasing transfers in your group chat",
    template: "%s | Paylance"
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "event ticketing Nigeria",
    "collect money for event",
    "sell tickets Nigeria",
    "Paystack",
    "party payment link",
    "creator storefront"
  ],
  openGraph: {
    title: "Paylance — Stop chasing transfers in your group chat",
    description: SITE_DESCRIPTION,
    siteName: "Paylance",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Paylance — Stop chasing transfers in your group chat",
    description: SITE_DESCRIPTION
  }
};

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
        <AuthProvider>
          {children}
          <Toaster
            theme="dark"
            position="top-right"
            toastOptions={{
              style: {
                background: "#18181b",
                border: "1px solid #27272a",
                color: "#fafafa",
              },
            }}
          />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
