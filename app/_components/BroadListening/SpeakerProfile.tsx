"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { Quote, Users, MessageCircle, Hash, ArrowLeft } from "lucide-react";
import { TSpeaker, TClaimAgreement } from "./utils/parse-speakers";
import { TopicColors } from "./utils/parse-topics";
import ClaimAgreement from "./ClaimAgreement";

interface SpeakerProfileProps {
  speaker: TSpeaker;
  claimAgreements: Record<string, TClaimAgreement>;
  reportUrl: string;
}

const SpeakerProfile = ({ speaker, claimAgreements, reportUrl }: SpeakerProfileProps) => {
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [filterTopic, setFilterTopic] = useState<string>("all");

  const getAvatarColor = (speakerId: string) => {
    const index = speakerId.length % TopicColors.length;
    return `rgb(${TopicColors[index]})`;
  };

  const groupedClaims = speaker.claims.reduce((acc, claim) => {
    const topicKey = claim.topic.title;
    if (!acc[topicKey]) {
      acc[topicKey] = {};
    }
    
    const subtopicKey = claim.subtopic.title;
    if (!acc[topicKey][subtopicKey]) {
      acc[topicKey][subtopicKey] = [];
    }
    
    acc[topicKey][subtopicKey].push(claim);
    return acc;
  }, {} as Record<string, Record<string, typeof speaker.claims>>);

  const filteredGroupedClaims = filterTopic === "all" 
    ? groupedClaims 
    : { [filterTopic]: groupedClaims[filterTopic] || {} };

  const uniqueTopics = Object.keys(groupedClaims);

  const getClaimAgreement = (claimId: string) => {
    // For similar claims, we need to find the original claim ID
    const claim = speaker.claims.find(c => c.id === claimId);
    const agreementKey = claim?.originalClaimId || claimId;
    return claimAgreements[agreementKey];
  };

  return (
    <Container className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="p-2"
        >
          <ArrowLeft className="size-4" />
        </Button>
        
        <div 
          className="size-16 rounded-full flex items-center justify-center text-white font-bold text-2xl"
          style={{ backgroundColor: getAvatarColor(speaker.id) }}
        >
          {speaker.name.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{speaker.name}</h1>
          <p className="text-lg text-muted-foreground">Speaker Profile</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200/50">
          <div className="flex items-center gap-3">
            <MessageCircle className="size-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-700">{speaker.quotesCount}</div>
              <div className="text-sm font-medium text-blue-600">Quotes</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200/50">
          <div className="flex items-center gap-3">
            <Hash className="size-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-700">{speaker.claims.length}</div>
              <div className="text-sm font-medium text-green-600">Claims</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200/50">
          <div className="flex items-center gap-3">
            <Hash className="size-8 text-purple-600" />
            <div>
              <div className="text-2xl font-bold text-purple-700">{speaker.topicsCount}</div>
              <div className="text-sm font-medium text-purple-600">Topics</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200/50">
          <div className="flex items-center gap-3">
            <Hash className="size-8 text-orange-600" />
            <div>
              <div className="text-2xl font-bold text-orange-700">{speaker.subtopicsCount}</div>
              <div className="text-sm font-medium text-orange-600">Subtopics</div>
            </div>
          </div>
        </div>
      </div>

      {/* Topic Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filterTopic === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterTopic("all")}
        >
          All Topics
        </Button>
        {uniqueTopics.map((topic) => (
          <Button
            key={topic}
            variant={filterTopic === topic ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterTopic(topic)}
          >
            {topic}
          </Button>
        ))}
      </div>

      {/* Claims by Topic/Subtopic */}
      <div className="space-y-8">
        {Object.entries(filteredGroupedClaims).map(([topicTitle, subtopics]) => {
          const firstClaim = Object.values(subtopics)[0]?.[0];
          const topicColorIndex = firstClaim?.topic.colorIndex || 0;
          const topicColor = `rgb(${TopicColors[topicColorIndex]})`;

          return (
            <div key={topicTitle} className="space-y-6">
              <div className="flex items-center gap-3">
                <div 
                  className="w-1 h-8 rounded-full"
                  style={{ backgroundColor: topicColor }}
                />
                <h2 className="text-2xl font-bold tracking-tight">{topicTitle}</h2>
              </div>

              {Object.entries(subtopics).map(([subtopicTitle, claims]) => (
                <div key={subtopicTitle} className="ml-4 space-y-4">
                  <h3 className="text-lg font-semibold text-foreground/90">
                    {subtopicTitle}
                  </h3>

                  <div className="space-y-3">
                    {claims.map((claim) => {
                      const agreement = getClaimAgreement(claim.id);
                      const agreementCount = agreement?.speakers.length || 1;
                      
                      return (
                        <div 
                          key={claim.id}
                          className="bg-card border border-border rounded-lg p-4 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground leading-relaxed">
                                {claim.content}
                                {claim.isSimilarClaim && (
                                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                    Similar Claim
                                  </span>
                                )}
                              </h4>
                              <div className="mt-2 p-3 bg-muted/30 rounded-md">
                                <div className="flex items-start gap-2">
                                  <Quote className="size-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                  <blockquote className="text-sm text-foreground/80 italic">
                                    "{claim.quote.text}"
                                  </blockquote>
                                </div>
                              </div>
                            </div>
                          </div>

                          {agreement && agreementCount > 1 && (
                            <div className="flex items-center justify-between pt-2 border-t border-border">
                              <span className="text-sm text-muted-foreground">
                                {agreementCount} people agree with this
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedClaimId(claim.originalClaimId || claim.id)}
                              >
                                <Users className="size-4 mr-2" />
                                See who agrees
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Claim Agreement Modal */}
      {selectedClaimId && claimAgreements[selectedClaimId] && (
        <ClaimAgreement
          agreement={claimAgreements[selectedClaimId]}
          onClose={() => setSelectedClaimId(null)}
          reportUrl={reportUrl}
        />
      )}
    </Container>
  );
};

export default SpeakerProfile; 