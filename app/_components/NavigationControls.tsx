"use client";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const NavigationControls = () => {
  const router = useRouter();
  return (
    <Container className="flex items-center mb-4">
      <Button variant={"ghost"} onClick={() => router.back()}>
        <ChevronLeft /> Back
      </Button>
    </Container>
  );
};

export default NavigationControls;
