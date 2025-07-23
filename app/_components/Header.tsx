import Container from "@/components/ui/container";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = ({ cta }: { cta?: React.ReactNode }) => {
  return (
    <Container
      outerClassName="sticky top-4 px-4 mb-12 z-50"
      className="bg-background/95 backdrop-blur-sm py-3 px-4 flex items-center justify-between gap-4"
    >
      <Link href="/" className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-md overflow-hidden">
          <Image
            src="/broadlistening-logo.png"
            alt="BroadListening Logo"
            width={32}
            height={32}
          />
        </div>
        <span className="text-xl font-semibold tracking-tight">BroadListening</span>
      </Link>
      {cta}
    </Container>
  );
};

export default Header;
