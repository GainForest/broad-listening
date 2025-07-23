import Bhutan2035 from "@/app/_components/BroadListening";
import Container from "@/components/ui/container";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import parseTopics from "@/app/_components/BroadListening/utils/parse-topics";

// Force dynamic rendering to prevent prerender errors
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ report?: string }>;
}): Promise<Metadata> {
  const searchParamsData = await searchParams;
  const encodedReportUrl = searchParamsData.report;
  
  if (!encodedReportUrl) {
    return {
      title: "Dashboard - Broad Listening",
      description: "Explore analysis results and insights from interview data",
    };
  }

  try {
    const reportUrl = decodeURIComponent(encodedReportUrl);
    const topicsResponse = await fetch(reportUrl);
    const topicsData = await topicsResponse.json();
    const parsedTopics = parseTopics(topicsData);
    
    const totalTopics = parsedTopics.topics.length;
    const totalPeople = new Set(
      parsedTopics.topics.flatMap(topic =>
        topic.subtopics.flatMap(subtopic =>
          subtopic.claims.flatMap(claim =>
            claim.quotes.map(quote => quote.authorId)
          )
        )
      )
    ).size;

    const title = `Analysis Dashboard - ${totalTopics} Topics, ${totalPeople} People - Broad Listening`;
    const description = `Explore detailed analysis of ${totalTopics} topics with insights from ${totalPeople} participants. Interactive visualizations and demographic breakdowns.`;

    const ogUrl = `https://www.broadlistening.org/api/og?title=${encodeURIComponent(`Report Analysis Dashboard`)}&description=${encodeURIComponent(`${totalTopics} topics analyzed from ${totalPeople} participants`)}&type=dashboard`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://www.broadlistening.org/dashboard`,
        siteName: "Broad Listening",
        images: [
          {
            url: ogUrl,
            width: 1200,
            height: 630,
            alt: "Broad Listening Dashboard - Report Analysis",
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogUrl],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Dashboard - Broad Listening",
      description: "Explore analysis results and insights from interview data",
    };
  }
}

interface DashboardPageProps {
  searchParams: Promise<{ report?: string }>;
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const searchParamsData = await searchParams;
  const encodedReportUrl = searchParamsData.report;

  if (!encodedReportUrl) {
    return (
      <Container className="flex flex-col gap-4 items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Report URL Required</h1>
          <p className="text-muted-foreground">
            Please provide a report URL to view the dashboard.
          </p>
          <Link href="/">
            <Button>Enter Report URL</Button>
          </Link>
        </div>
      </Container>
    );
  }

  const reportUrl = decodeURIComponent(encodedReportUrl);

  return (
    <Container className="flex flex-col gap-4">
      <Bhutan2035 reportUrl={reportUrl} />
    </Container>
  );
};

export default DashboardPage;
