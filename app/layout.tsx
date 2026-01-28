import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SharpML - Transform Photos into 3D Memories",
  description: "Convert your photos and memories into beautiful, interactive 3D Gaussian splats. Experience your moments in a new dimension.",
  keywords: ["3D", "Gaussian splats", "photo to 3D", "memories", "interactive 3D"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
