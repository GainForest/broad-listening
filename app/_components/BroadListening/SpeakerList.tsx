"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { Search, User, MessageCircle, Hash, ChevronRight } from "lucide-react";
import { TSpeaker } from "./utils/parse-speakers";
import { TopicColors } from "./utils/parse-topics";

interface SpeakerListProps {
  speakers: TSpeaker[];
  reportUrl: string;
}

const SpeakerList = ({ speakers, reportUrl }: SpeakerListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"quotes" | "topics" | "name">("quotes");

  const filteredSpeakers = speakers
    .filter(speaker => 
      speaker.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "quotes":
          return b.quotesCount - a.quotesCount;
        case "topics":
          return b.topicsCount - a.topicsCount;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const getTopTopics = (speaker: TSpeaker) => {
    return Object.entries(speaker.topicDistribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([topic]) => topic);
  };

  const getAvatarColor = (speakerId: string) => {
    const index = speakerId.length % TopicColors.length;
    return `rgb(${TopicColors[index]})`;
  };

  return (
    <Container className="space-y-6">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Speakers Analytics</h1>
        <p className="text-lg text-muted-foreground">
          Explore what each participant contributed to the discussion
        </p>
      </header>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search speakers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={sortBy === "quotes" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("quotes")}
          >
            Most Active
          </Button>
          <Button
            variant={sortBy === "topics" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("topics")}
          >
            Most Topics
          </Button>
          <Button
            variant={sortBy === "name" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("name")}
          >
            Name
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200/50">
          <div className="flex items-center gap-3">
            <User className="size-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-700">{speakers.length}</div>
              <div className="text-sm font-medium text-blue-600">Total Speakers</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200/50">
          <div className="flex items-center gap-3">
            <MessageCircle className="size-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-700">
                {speakers.reduce((acc, s) => acc + s.quotesCount, 0)}
              </div>
              <div className="text-sm font-medium text-green-600">Total Quotes</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200/50">
          <div className="flex items-center gap-3">
            <Hash className="size-8 text-purple-600" />
            <div>
              <div className="text-2xl font-bold text-purple-700">
                {speakers.reduce((acc, s) => acc + s.claims.length, 0)}
              </div>
              <div className="text-sm font-medium text-purple-600">Total Claims</div>
            </div>
          </div>
        </div>
      </div>

      {/* Speaker Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpeakers.map((speaker) => {
          const topTopics = getTopTopics(speaker);
          
          return (
            <div
              key={speaker.id}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all duration-200 group cursor-pointer"
              onClick={() => {
                window.location.href = `/dashboard/speakers/${encodeURIComponent(speaker.id)}?report=${encodeURIComponent(reportUrl)}`;
              }}
            >
              {/* Speaker Header */}
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="size-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                  style={{ backgroundColor: getAvatarColor(speaker.id) }}
                >
                  {speaker.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {speaker.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{speaker.quotesCount} quotes</span>
                    <span>{speaker.topicsCount} topics</span>
                  </div>
                </div>
                <ChevronRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>

              {/* Topic Distribution */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Top Topics</h4>
                <div className="flex flex-wrap gap-1">
                  {topTopics.map((topic, index) => (
                    <span
                      key={topic}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted/50 text-muted-foreground"
                    >
                      {topic}
                      <span className="ml-1 font-medium">
                        ({speaker.topicDistribution[topic]})
                      </span>
                    </span>
                  ))}
                  {Object.keys(speaker.topicDistribution).length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-primary/10 text-primary">
                      +{Object.keys(speaker.topicDistribution).length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Stats Bar */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Claims</span>
                  <span className="font-medium">{speaker.claims.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtopics</span>
                  <span className="font-medium">{speaker.subtopicsCount}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSpeakers.length === 0 && (
        <div className="text-center py-12">
          <User className="size-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No speakers found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters.
          </p>
        </div>
      )}
    </Container>
  );
};

export default SpeakerList; 