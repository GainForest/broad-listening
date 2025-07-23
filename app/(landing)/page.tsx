"use client";

import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, FileText, MessageCircle, Users, Brain, Link } from "lucide-react";
import Image from "next/image";

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

  const useCases = [
    {
      title: "Envision Bhutan 2035",
      description: "National visioning consultation with citizens across Bhutan",
      category: "National Planning",
      url: "https://storage.googleapis.com/tttc-light-dev/f6d673c83bf46557b0a1e3401f109bb10fad76d354a4eb0af0264daf90c93ce1",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      title: "Community Climate Action",
      description: "Local climate resilience planning with diverse stakeholders",
      category: "Environmental Policy",
      url: "#", // Placeholder for future use case
      gradient: "from-green-500 to-teal-600"
    },
    {
      title: "Healthcare Reform Insights",
      description: "Patient and provider perspectives on healthcare accessibility",
      category: "Public Health",
      url: "#", // Placeholder for future use case
      gradient: "from-red-500 to-pink-600"
    },
    {
      title: "Urban Planning Voices",
      description: "Resident input on sustainable city development initiatives",
      category: "Municipal Planning",
      url: "#", // Placeholder for future use case
      gradient: "from-orange-500 to-yellow-600"
    }
  ];

  const handleUseCaseClick = (useCase: typeof useCases[0]) => {
    if (useCase.url !== "#") {
      const encodedUrl = encodeURIComponent(useCase.url);
      router.push(`/dashboard?report=${encodedUrl}`);
    }
  };

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
                <p className="text-xs text-gray-500 text-center">
                  Your data should be publicly accessible JSON following our schema. 
                  Works with Google Storage, GitHub, AWS S3, and any CORS-enabled endpoint.
                </p>
              </div>
            </div>
          </div>

          {/* Use Cases Gallery */}
          <div className="mt-16 space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-light text-gray-900">
                Use Cases
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore real-world applications of democratic listening across different domains
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((useCase, index) => (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 ${
                    useCase.url !== "#" ? "cursor-pointer" : ""
                  }`}
                  onClick={() => handleUseCaseClick(useCase)}
                >
                  {/* Header with Image or Gradient */}
                  <div className={`h-32 relative ${useCase.title === "Envision Bhutan 2035" ? "bg-gray-100" : `bg-gradient-to-br ${useCase.gradient}`}`}>
                    {useCase.title === "Envision Bhutan 2035" ? (
                      <Image
                        src="/bhutan.png"
                        alt="Bhutan landscape"
                        fill
                        className="object-cover"
                      />
                    ) : null}
                    
                    {useCase.url !== "#" && (
                      <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-1.5">
                        <Link className="size-3 text-white" />
                      </div>
                    )}
                    {useCase.url === "#" && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <span className="text-white/80 text-xs font-medium">Coming Soon</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {useCase.category}
                      </div>
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                        {useCase.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {useCase.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* About DeepGov Section */}
          <div className="mt-16 text-center space-y-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-light text-gray-900 mb-6">
                About DeepGov
              </h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-left">
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  DeepGov is an open source collective pioneering democratic AI for governance and capital allocation. 
                  We believe in transparent, participatory technologies that amplify citizen voices and strengthen 
                  democratic institutions.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Our tools help governments, organizations, and communities make better decisions by democratizing 
                  access to sophisticated analysis and ensuring that every voice is heard in the decision-making process.
                </p>
              </div>
            </div>
          </div>

          {/* How it works Section */}
          <div className="mt-16 text-center space-y-8">
            <h2 className="text-2xl font-light text-gray-900">
              How it works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="bg-blue-100 rounded-full p-3 flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-600">1</span>
                  </div>
                </div>
                <h3 className="font-medium text-gray-900">Gather</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Gather and analyze qualitative data from a group of any size. Process unstructured text, long form responses, 
                  and video interviews, or prompt participants over Telegram with a custom chatbot.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="bg-green-100 rounded-full p-3 flex items-center justify-center">
                    <span className="text-lg font-bold text-green-600">2</span>
                  </div>
                </div>
                <h3 className="font-medium text-gray-900">Explore</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Explore from core themes within the data all the way down to individual claims and quotes made by each 
                  participant.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="bg-purple-100 rounded-full p-3 flex items-center justify-center">
                    <span className="text-lg font-bold text-purple-600">3</span>
                  </div>
                </div>
                <h3 className="font-medium text-gray-900">Share</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Share your findings and the voices within your communities to inform direction and decision making.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
