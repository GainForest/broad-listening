import parseTopics from "@/app/_components/BroadListening/utils/parse-topics";
import Container from "@/components/ui/container";
import { MessageCircle, Quote, User2 } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import { PiTreeStructure } from "react-icons/pi";
import SubTopic from "./SubTopic";
import fetchDemographics from "@/app/_components/BroadListening/utils/fetch-demographics";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TSimilarClaim, TQuote } from "@/app/_components/BroadListening/TopicItem";
import { Metadata } from "next";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ topicId: string }>;
  searchParams: Promise<{ report?: string }>;
}): Promise<Metadata> {
  const searchParamsData = await searchParams;
  const encodedReportUrl = searchParamsData.report;
  
  if (!encodedReportUrl) {
    return {
      title: "Topic Not Found - Broad Listening",
      description: "The requested topic could not be found.",
    };
  }

  try {
    const reportUrl = decodeURIComponent(encodedReportUrl);
    const topicsResponse = await fetch(reportUrl);
    const topicsData = await topicsResponse.json();
    const parsedTopics = parseTopics(topicsData);
    
    const paramsData = await params;
    const topic = parsedTopics.topics.find(
      (topic) => topic.id === paramsData.topicId
    );

    if (!topic) {
      return {
        title: "Topic Not Found - Broad Listening",
        description: "The requested topic could not be found.",
      };
    }

    // Calculate stats for OG image
    const totalQuotes = topic.subtopics.reduce((acc, subtopic) => {
      return acc + subtopic.claims.reduce((claimAcc, claim) => {
        const mainQuotes = claim.quotes?.length || 0;
        const similarQuotes = claim.similarClaims?.reduce((similarAcc: number, similarClaim: TSimilarClaim) => 
          similarAcc + (similarClaim.quotes?.length || 0), 0) || 0;
        return claimAcc + mainQuotes + similarQuotes;
      }, 0);
    }, 0);

    const topicPeople = new Set<string>();
    topic.subtopics.forEach((subtopic) => {
      subtopic.claims.forEach((claim) => {
        claim.quotes.forEach((quote) => {
          topicPeople.add(quote.authorId);
        });
        claim.similarClaims?.forEach((similarClaim: TSimilarClaim) => {
          similarClaim.quotes?.forEach((quote: TQuote) => {
            topicPeople.add(quote.authorId);
          });
        });
      });
    });

    const totalClaims = topic.subtopics.reduce((acc, subtopic) => acc + subtopic.claims.length, 0);
    const stats = `${totalClaims},${topicPeople.size},${topic.subtopics.length},${totalQuotes}`;

    const title = `${topic.title} - Broad Listening`;
    const description = topic.description || `Analysis of ${topic.title} with ${totalClaims} claims from ${topicPeople.size} people`;

    const ogUrl = `/api/og?title=${encodeURIComponent(topic.title)}&description=${encodeURIComponent(topic.description || '')}&type=topic&stats=${encodeURIComponent(stats)}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://broadlistening.com/dashboard/${paramsData.topicId}`,
        siteName: "Broad Listening",
        images: [
          {
            url: ogUrl,
            width: 1200,
            height: 630,
            alt: `${topic.title} - Topic Analysis`,
          },
        ],
        locale: "en_US",
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogUrl],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Topic Analysis - Broad Listening",
      description: "Explore topic analysis and insights from interview data",
    };
  }
}

const TopicPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ topicId: string }>;
  searchParams: Promise<{ report?: string }>;
}) => {
  const searchParamsData = await searchParams;
  const encodedReportUrl = searchParamsData.report;
  
  if (!encodedReportUrl) {
    return (
      <Container className="flex flex-col gap-4 items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Report URL Required</h1>
          <p className="text-muted-foreground">
            Please provide a report URL to view this topic.
          </p>
          <Link href="/">
            <Button>Enter Report URL</Button>
          </Link>
        </div>
      </Container>
    );
  }

  const reportUrl = decodeURIComponent(encodedReportUrl);
  const topicsPromise = fetch(reportUrl);
  const parsedTopicsPromise = topicsPromise.then((res) => {
    return res.json().then((json) => {
      return parseTopics(json);
    });
  });

  const [paramsData, parsedTopics, demographics] = await Promise.all([
    params,
    parsedTopicsPromise,
    fetchDemographics(),
  ]);
  const topic = parsedTopics.topics.find(
    (topic) => topic.id === paramsData.topicId
  );

  console.log(parsedTopics, "parsedTopics")
  if (!topic) redirect("/not-found");

  // Calculate total quotes including similar claims
  const totalQuotes = topic.subtopics.reduce((acc, subtopic) => {
    return acc + subtopic.claims.reduce((claimAcc, claim) => {
      const mainQuotes = claim.quotes?.length || 0;
      const similarQuotes = claim.similarClaims?.reduce((similarAcc: number, similarClaim: TSimilarClaim) => 
        similarAcc + (similarClaim.quotes?.length || 0), 0) || 0;
      return claimAcc + mainQuotes + similarQuotes;
    }, 0);
  }, 0);

  // Calculate total people for this topic
  const topicPeople = new Set<string>();
  topic.subtopics.forEach((subtopic) => {
    subtopic.claims.forEach((claim) => {
      claim.quotes.forEach((quote) => {
        topicPeople.add(quote.authorId);
      });
      claim.similarClaims?.forEach((similarClaim: TSimilarClaim) => {
        similarClaim.quotes?.forEach((quote: TQuote) => {
          topicPeople.add(quote.authorId);
        });
      });
    });
  });

  const totalTopicClaims = topic.subtopics.reduce((acc, subtopic) => acc + subtopic.claims.length, 0);

  return (
    <Container className="space-y-8">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">{topic.title}</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">{topic.description}</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 flex flex-col text-blue-700 relative overflow-hidden border border-blue-200/50">
          <span className="text-2xl font-bold">{totalTopicClaims}</span>
          <span className="text-sm font-medium">Claims</span>
          <MessageCircle className="size-8 absolute bottom-2 right-2 opacity-30" />
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 flex flex-col text-green-700 relative overflow-hidden border border-green-200/50">
          <span className="text-2xl font-bold">{topicPeople.size}</span>
          <span className="text-sm font-medium">People</span>
          <User2 className="size-8 absolute bottom-2 right-2 opacity-30" />
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 flex flex-col text-purple-700 relative overflow-hidden border border-purple-200/50">
          <span className="text-2xl font-bold">{topic.subtopics.length}</span>
          <span className="text-sm font-medium">Subtopics</span>
          <PiTreeStructure className="size-8 absolute bottom-2 right-2 opacity-30" />
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 flex flex-col text-orange-700 relative overflow-hidden border border-orange-200/50">
          <span className="text-2xl font-bold">{totalQuotes}</span>
          <span className="text-sm font-medium">Quotes</span>
          <Quote className="size-8 absolute bottom-2 right-2 opacity-30" />
        </div>
      </div>

      <div className="space-y-8">
        {topic.subtopics.map((subtopic) => (
          <SubTopic
            key={subtopic.id}
            subtopic={subtopic}
            topic={topic}
            demographics={demographics}
          />
        ))}
      </div>
    </Container>
  );
};

export default TopicPage;
