import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = ({ cta }: { cta?: React.ReactNode }) => {
  return (
    <Container
      outerClassName="sticky top-2 px-2 mb-8 z-50"
      className="border border-border rounded-xl bg-background/70 backdrop-blur-lg py-2 px-2 md:px-2 flex items-center justify-between gap-2 shadow-lg"
    >
      <Link href="/" className="flex items-center gap-2">
        <div className="h-8 w-8 full border border-border rounded-full overflow-hidden">
          <Image
            src="/broadlistening-logo.png"
            alt="BroadListening Logo"
            width={64}
            height={64}
          />
        </div>
        <span className="text-lg font-bold font-pixel">BroadListening</span>
      </Link>
      {cta ?? <Button>Sign in</Button>}
    </Container>
  );
};

export default Header;
