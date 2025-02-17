import localFont from "next/font/local";
import "./assets/css/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Event Scheduler Pro",
  description: "Plan, organize, and manage your events with ease using ES Pro.",
  favicon: "/favicon.ico",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta property="og:title" content="ES Pro - Event Scheduler" />
        <meta property="og:description" content="Plan, organize, and manage your events with ease using ES Pro." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content="https://es-pro.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="Plan, organize, and manage your events with ease using ES Pro." />
        <meta name="twitter:title" content="ES Pro - Event Scheduler" />
        <meta name="twitter:description" content="Manage events efficiently with ES Pro. Plan, schedule, and collaborate seamlessly." />
        <meta name="twitter:image" content="/og-image.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-[100vw] `}
      >
        {children}
      </body>
    </html>
  );
}
