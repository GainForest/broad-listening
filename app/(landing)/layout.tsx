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
  description: "Transform interview data into actionable insights with AI-powered analysis. Visualize topics, demographics, and stakeholder perspectives in beautiful, interactive reports.",
  openGraph: {
    title: "Broad Listening",
    description: "Transform interview data into actionable insights with AI-powered analysis. Visualize topics, demographics, and stakeholder perspectives in beautiful, interactive reports.",
    url: "https://www.broadlistening.org",
    siteName: "Broad Listening",
    images: [
      {
        url: "https://www.broadlistening.org/api/og?title=Broad%20Listening&description=Transform%20interview%20data%20into%20actionable%20insights%20with%20AI-powered%20analysis&type=landing",
        width: 1200,
        height: 630,
        alt: "Broad Listening - Transform interview data into actionable insights",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Broad Listening",
    description: "Transform interview data into actionable insights with AI-powered analysis",
    images: ["https://www.broadlistening.org/api/og?title=Broad%20Listening&description=Transform%20interview%20data%20into%20actionable%20insights%20with%20AI-powered%20analysis&type=landing"],
  },
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
