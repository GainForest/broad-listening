import Bhutan2035 from "@/app/_components/Bhutan2035";
import Container from "@/components/ui/container";
import React from "react";

// Force dynamic rendering to prevent prerender errors
export const dynamic = 'force-dynamic';

const DashboardPage = () => {
  return (
    <Container className="flex flex-col gap-4">
      <Bhutan2035 />
    </Container>
  );
};

export default DashboardPage;
