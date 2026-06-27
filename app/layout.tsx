import type { Metadata, Viewport } from "next";
import "./globals.css";
import StarField from "./components/StarField";

export const metadata: Metadata = {
  title: "Hasan's First Birthday ✈️",
  description: "Celebrating Hasan's first trip around the sun!",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Hasan's Birthday",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">
        <StarField />
        {children}
      </body>
    </html>
  );
}
