import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage-grotesque"
});

// Editorial counterweight to Bricolage's chunkiness — used only for
// accent words on the marketing site, never in the app.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif"
});

const SITE_DESCRIPTION =
  "Sell digital products, run paid events and book sessions from one link. Know who your buyers are, track what you earn, and get paid straight to your bank.";

export const metadata: Metadata = {
  title: {
    default: "Paylance — Run your whole business from one link",
    template: "%s | Paylance"
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "creator business",
    "sell digital products",
    "event ticketing",
    "creator storefront",
    "link in bio payments",
    "creator payouts"
  ],
  openGraph: {
    title: "Paylance — Run your whole business from one link",
    description: SITE_DESCRIPTION,
    siteName: "Paylance",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Paylance — Run your whole business from one link",
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
      <body className={`${bricolageGrotesque.variable} ${instrumentSerif.variable}`}>
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
