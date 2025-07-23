"use client";

import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, FileText, MessageCircle, Users, Brain, Link } from "lucide-react";

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

  const features = [
    {
      icon: <Brain className="size-5 text-blue-600" />,
      title: "AI-Powered Analysis",
      description: "Automatically extracts insights and patterns from interview data"
    },
    {
      icon: <MessageCircle className="size-5 text-green-600" />,
      title: "Claim Organization",
      description: "Groups related statements and quotes into coherent topics"
    },
    {
      icon: <BarChart3 className="size-5 text-purple-600" />,
      title: "Demographics Breakdown",
      description: "Visualizes participation by age, gender, and other demographics"
    },
    {
      icon: <Users className="size-5 text-orange-600" />,
      title: "Stakeholder Insights",
      description: "Tracks which participants contributed to each topic area"
    }
  ];

  const exampleUrls = [
    "https://storage.googleapis.com/bucket/report.json",
    "https://raw.githubusercontent.com/user/repo/data.json",
    "https://api.example.com/reports/123"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Container className="py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-16">
            <h1 className="text-4xl md:text-5xl font-light text-gray-900">
              Broad Listening
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Transform interview data into actionable insights with AI-powered analysis. 
              Visualize topics, demographics, and stakeholder perspectives in beautiful, 
              interactive reports.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {feature.icon}
                    <h3 className="font-medium text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Section */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="text-center space-y-4 mb-8">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <FileText className="size-5" />
                  <span className="font-medium">Get Started</span>
                </div>
                <p className="text-gray-600">
                  Enter your report data URL to begin analysis
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <input
                    id="storage-url"
                    type="url"
                    value={storageUrl}
                    onChange={(e) => setStorageUrl(e.target.value)}
                    placeholder="https://your-data-source.com/report.json"
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-4 text-base font-medium"
                  disabled={isLoading || !storageUrl.trim()}
                >
                  {isLoading ? "Loading..." : "Analyze Report"}
                </Button>
              </form>

              {/* Data Format Info */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Link className="size-4" />
                    Supported Data Sources
                  </div>
                  <div className="grid gap-2">
                    {exampleUrls.map((url, index) => (
                      <div key={index} className="text-xs font-mono text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                        {url}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Your data should be publicly accessible JSON following our schema. 
                    Works with Google Storage, GitHub, AWS S3, and any CORS-enabled endpoint.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-16 text-center space-y-6">
            <h2 className="text-2xl font-light text-gray-900">
              Why Use Broad Listening?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Save Time</h3>
                <p className="text-sm text-gray-600">
                  Automatically process hours of interview data in seconds
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Find Patterns</h3>
                <p className="text-sm text-gray-600">
                  Discover hidden connections and themes across stakeholder groups
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Share Insights</h3>
                <p className="text-sm text-gray-600">
                  Generate beautiful, interactive reports for stakeholders
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
