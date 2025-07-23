"use client";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const NavigationControls = () => {
  const router = useRouter();
  return (
    <Container className="flex items-center py-4 border-b border-gray-50">
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 text-sm font-medium"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> 
        Back
      </Button>
    </Container>
  );
};

export default NavigationControls;
