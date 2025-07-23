import Bhutan2035 from "@/app/_components/BroadListening";
import Container from "@/components/ui/container";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Force dynamic rendering to prevent prerender errors
export const dynamic = 'force-dynamic';

interface DashboardPageProps {
  searchParams: { report?: string };
}

const DashboardPage = ({ searchParams }: DashboardPageProps) => {
  const encodedReportUrl = searchParams.report;

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
