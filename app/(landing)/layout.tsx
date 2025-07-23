import type { Metadata } from "next";
import { Karla, Libre_Baskerville } from "next/font/google";
import "./../globals.css";
import Header from "../_components/Header";
import { TooltipProvider } from "@/components/ui/tooltip";

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
  title: "Broad Listening",
  description: "AI-powered report analysis platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${karla.variable} ${libreBaskerville.variable} antialiased bg-white`}>
        <TooltipProvider>
          <Header />
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
