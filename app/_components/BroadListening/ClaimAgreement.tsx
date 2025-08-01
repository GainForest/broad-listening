"use client";

import { Button } from "@/components/ui/button";
import { X, Quote, User } from "lucide-react";
import { TClaimAgreement } from "./utils/parse-speakers";
import { TopicColors } from "./utils/parse-topics";

interface ClaimAgreementProps {
  agreement: TClaimAgreement;
  onClose: () => void;
  reportUrl: string;
}

const ClaimAgreement = ({ agreement, onClose, reportUrl }: ClaimAgreementProps) => {
  const getAvatarColor = (speakerId: string) => {
    const index = speakerId.length % TopicColors.length;
    return `rgb(${TopicColors[index]})`;
  };

  const handleSpeakerClick = (speakerId: string) => {
    window.location.href = `/dashboard/speakers/${encodeURIComponent(speakerId)}?report=${encodeURIComponent(reportUrl)}`;
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">Who agrees with this claim?</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {agreement.speakers.length} people share this perspective
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Claim Title */}
        <div className="p-6 border-b border-border bg-muted/30">
          <h3 className="font-medium text-foreground leading-relaxed">
            {agreement.claimTitle}
          </h3>
        </div>

        {/* Speakers List */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[50vh]">
          {agreement.speakers.map((speaker, index) => (
            <div
              key={`${speaker.speakerId}-${index}`}
              className="flex items-start gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-sm transition-all cursor-pointer"
              onClick={() => handleSpeakerClick(speaker.speakerId)}
            >
              {/* Speaker Avatar */}
              <div 
                className="size-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                style={{ backgroundColor: getAvatarColor(speaker.speakerId) }}
              >
                {speaker.speakerName.charAt(0).toUpperCase()}
              </div>

              {/* Speaker Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-foreground hover:text-primary transition-colors">
                    {speaker.speakerName}
                  </h4>
                  {speaker.isSimilarClaim && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Similar Claim
                    </span>
                  )}
                </div>
                
                {/* Quote */}
                <div className="p-3 bg-muted/30 rounded-md">
                  <div className="flex items-start gap-2">
                    <Quote className="size-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <blockquote className="text-sm text-foreground/80 italic leading-relaxed">
                      "{speaker.quote}"
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="size-4" />
              <span>Click on any speaker to view their full profile</span>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimAgreement; 