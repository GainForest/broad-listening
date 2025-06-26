import Stats from "@/app/_components/Stats";
import Topics from "@/app/_components/Topics";
import Container from "@/components/ui/container";
import React from "react";

const DashboardPage = () => {
  return (
    <Container className="flex flex-col gap-4">
      <Stats />
      <Topics />
    </Container>
  );
};

export default DashboardPage;
