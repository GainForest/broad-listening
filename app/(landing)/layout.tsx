import type { Metadata } from "next";
import { Karla, Libre_Baskerville } from "next/font/google";
import "./../globals.css";
import Header from "../_components/Header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
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
        className={`${karla.variable} ${libreBaskerville.variable} antialiased h-screen w-screen flex flex-col`}
        style={{
          backgroundImage: "url('/broadlistening-landing.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <TooltipProvider>
          <Header
            cta={
              <Link href="/dashboard">
                <Button>Live Results</Button>
              </Link>
            }
          />
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
