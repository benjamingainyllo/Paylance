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
  "Paylance is the creator business OS for Africa. Sell digital products, host paid events, grow your audience and get paid in Naira — all from one dashboard.";

export const metadata: Metadata = {
  title: {
    default: "Paylance — Turn your audience into a real business",
    template: "%s | Paylance"
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "creator economy",
    "sell digital products",
    "event ticketing",
    "Paystack",
    "Nigeria",
    "creator storefront"
  ],
  openGraph: {
    title: "Paylance — Turn your audience into a real business",
    description: SITE_DESCRIPTION,
    siteName: "Paylance",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Paylance — Turn your audience into a real business",
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
