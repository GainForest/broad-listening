import type { Metadata } from "next";
import { Geist, Geist_Mono, VT323 } from "next/font/google";
import "./../globals.css";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import NavigationControls from "../_components/NavigationControls";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vt323 = VT323({
  variable: "--font-pixel",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BroadListening",
  description: "Imagining Bhutan's Future Together",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${vt323.variable} antialiased`}
      >
        <TooltipProvider>
          <Header />
          <NavigationControls />
          {children}
          <Footer />
        </TooltipProvider>
      </body>
    </html>
  );
}
