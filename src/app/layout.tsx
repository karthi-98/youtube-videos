import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { getVideoDocuments } from "@/actions/video-actions";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "YouTube Watch Later",
  description: "Manage your YouTube watch later videos",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const result = await getVideoDocuments();
  const documents = result.success && result.documents ? result.documents : [];

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${sourceSerif.variable} antialiased`}
      >
        <SidebarLayout documents={documents}>
          {children}
        </SidebarLayout>
      </body>
    </html>
  );
}
