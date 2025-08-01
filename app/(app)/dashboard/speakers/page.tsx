import parseTopics from "@/app/_components/BroadListening/utils/parse-topics";
import parseSpeakers from "@/app/_components/BroadListening/utils/parse-speakers";
import SpeakerList from "@/app/_components/BroadListening/SpeakerList";
import Container from "@/components/ui/container";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Force dynamic rendering to prevent prerender errors
export const dynamic = 'force-dynamic';

interface SpeakersPageProps {
  searchParams: Promise<{ report?: string }>;
}

const SpeakersPage = async ({ searchParams }: SpeakersPageProps) => {
  const searchParamsData = await searchParams;
  const encodedReportUrl = searchParamsData.report;

  if (!encodedReportUrl) {
    return (
      <Container className="flex flex-col gap-4 items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Report URL Required</h1>
          <p className="text-muted-foreground">
            Please provide a report URL to view speakers analytics.
          </p>
          <Link href="/">
            <Button>Enter Report URL</Button>
          </Link>
        </div>
      </Container>
    );
  }

  const reportUrl = decodeURIComponent(encodedReportUrl);
  
  try {
    const response = await fetch(reportUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const json = await response.json();
    const parsedTopics = parseTopics(json);
    const { speakers } = parseSpeakers(parsedTopics.topics);

    return <SpeakerList speakers={speakers} reportUrl={reportUrl} />;
  } catch (error) {
    console.error("Error fetching report data:", error);
    
    return (
      <Container className="flex flex-col gap-4 items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Error Loading Data</h1>
          <p className="text-muted-foreground">
            Failed to load the report data. Please check the URL and try again.
          </p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </Container>
    );
  }
};

export default SpeakersPage; 