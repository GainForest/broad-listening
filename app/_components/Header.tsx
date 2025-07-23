import Container from "@/components/ui/container";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = ({ cta }: { cta?: React.ReactNode }) => {
  return (
    <header className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <Container className="py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-7 w-7 rounded-lg overflow-hidden transition-transform group-hover:scale-105">
            <Image
              src="/broadlistening-logo.png"
              alt="BroadListening Logo"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <span className="text-lg font-medium text-gray-900 tracking-tight">
            DeepGov
          </span>
        </Link>
        {cta}
      </Container>
    </header>
  );
};

export default Header;
