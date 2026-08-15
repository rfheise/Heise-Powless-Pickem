import type { Metadata, Viewport } from "next";
import Script from "next/script";
import AppShell from "@/components/AppShell";

//Every stylesheet is global, imported here in the order create-react-app
//happened to bundle them (index.css and App.css first, then the component
//sheets). Keeping the order means the cascade and every specificity tie
//resolves exactly the way it does today.
import "@/styles/index.css";
import "@/styles/App.css";
import "@/styles/nav.css";
import "@/styles/background.css";
import "@/styles/link.css";
import "@/styles/user.css";
import "@/styles/form.css";
import "@/styles/announcement.css";
import "@/styles/career.css";
import "@/styles/hof.css";
import "@/styles/pick.css";
import "@/styles/recap.css";
import "@/styles/standing.css";
import "@/styles/burn.css";
import "@/styles/votes.css";

export const metadata: Metadata = {
  title: "Heise Powless Pickem",
  description: "Anotha One",
  icons: {
    icon: "/favicon.ico?v=1.02",
    apple: "/logo192.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#1B3A2F",
  width: "device-width",
  initialScale: 1,
};

const GA_ID = "G-KJ8THDENQN";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppShell>{children}</AppShell>
        {/* Global site tag (gtag.js) - Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
