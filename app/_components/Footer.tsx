import Container from "@/components/ui/container";
import React from "react";

const Footer = () => {
  return (
    <Container outerClassName="mt-16">
      <div className="flex items-center justify-between py-4 border-t border-border text-muted-foreground text-sm">
        <span>BroadListening.org</span>
        <span>All rights reserved</span>
      </div>
    </Container>
  );
};

export default Footer;
