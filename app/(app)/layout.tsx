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
  title: "Broad Listening Dashboard",
  description: "Explore analysis results and insights from interview data",
  openGraph: {
    title: "Broad Listening Dashboard",
    description: "Explore analysis results and insights from interview data",
    url: "https://www.broadlistening.org/dashboard",
    siteName: "Broad Listening",
    images: [
      {
        url: "https://www.broadlistening.org/api/og?title=Broad%20Listening%20Dashboard&description=Explore%20analysis%20results%20and%20insights%20from%20interview%20data&type=dashboard",
        width: 1200,
        height: 630,
        alt: "Broad Listening Dashboard - Explore analysis results",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Broad Listening Dashboard",
    description: "Explore analysis results and insights from interview data",
    images: ["https://www.broadlistening.org/api/og?title=Broad%20Listening%20Dashboard&description=Explore%20analysis%20results%20and%20insights%20from%20interview%20data&type=dashboard"],
  },
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
