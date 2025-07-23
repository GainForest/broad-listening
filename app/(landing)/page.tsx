"use client";

import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [storageUrl, setStorageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storageUrl.trim()) return;

    setIsLoading(true);
    
    if (!validateUrl(storageUrl.trim())) {
      alert("Please provide a valid URL.");
      setIsLoading(false);
      return;
    }

    // Redirect to dashboard with the full URL (encoded)
    const encodedUrl = encodeURIComponent(storageUrl.trim());
    router.push(`/dashboard?report=${encodedUrl}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Container className="w-full max-w-md">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-light text-gray-900">
              Broad Listening
            </h1>
            <p className="text-sm text-gray-500">
              Enter your report URL to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <input
                id="storage-url"
                type="url"
                value={storageUrl}
                onChange={(e) => setStorageUrl(e.target.value)}
                placeholder="https://storage.googleapis.com/..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full py-3"
              disabled={isLoading || !storageUrl.trim()}
            >
              {isLoading ? "Loading..." : "View Report"}
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
