import type { Metadata } from "next";
import { Karla, Libre_Baskerville } from "next/font/google";
import "./../globals.css";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import NavigationControls from "../_components/NavigationControls";

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
      <body className={`${karla.variable} ${libreBaskerville.variable} antialiased`}>
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
