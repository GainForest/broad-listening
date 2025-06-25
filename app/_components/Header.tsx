import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import React from "react";

const Header = () => {
  return (
    <Container
      outerClassName="sticky top-2 px-2 mb-8"
      className="border border-border rounded-xl bg-background/80 backdrop-blur-lg py-2 px-2 md:px-2 flex items-center justify-between gap-2 shadow-lg"
    >
      <span className="flex items-center gap-2">
        <div className="h-8 w-8 full border border-border rounded-full"></div>
        <span className="text-lg font-bold">BroadListening</span>
      </span>
      <Button>Talk to BroadListener</Button>
    </Container>
  );
};

export default Header;
