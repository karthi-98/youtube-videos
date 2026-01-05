import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { DesignProvider } from "@/components/providers/design-provider";
import { Header } from "@/components/layout/header";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "VideoVault",
  description: "Organize your YouTube video collections",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} antialiased bg-white`}>
        <DesignProvider>
          <Header />
          {children}
        </DesignProvider>
      </body>
    </html>
  );
}
