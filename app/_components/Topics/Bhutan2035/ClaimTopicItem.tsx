import { MessageCircle } from "lucide-react";
import React from "react";
import ClaimPopup from "./ClaimPopup";
import ClaimBoxes from "./ClaimBoxes";

export const TopicColors = [
  [239, 68, 68], // red-500
  [249, 115, 22], // orange-500
  [234, 88, 12], // amber-500
  [202, 138, 4], // yellow-500
  [132, 204, 22], // lime-500
  [34, 197, 94], // green-500
  [14, 159, 110], // emerald-500
  [6, 182, 212], // teal-500
  [20, 184, 166], // cyan-500
  [14, 165, 233], // sky-500
  [59, 130, 246], // blue-500
  [99, 102, 241], // indigo-500
  [139, 92, 246], // violet-500
  [168, 85, 247], // purple-500
  [217, 70, 239], // fuchsia-500
  [236, 72, 153], // pink-500
  [244, 63, 94], // rose-500
  [115, 115, 115], // neutral-500
];

export type TQuote = {
  id: string;
  text: string;
  authorId: string;
  authorIndex: number;
};

export type TClaim = {
  id: string;
  index: number;
  content: string;
  quotes: TQuote[];
};

export type TSubtopic = {
  id: string;
  title: string;
  description: string;
  claims: TClaim[];
};

export type TTopic = {
  id: string;
  title: string;
  description: string;
  subtopics: TSubtopic[];
  colorIndex: number;
};

const calculateTotalPeople = (topic: TTopic) => {
  const people = new Set<string>();
  topic.subtopics.forEach((subtopic) => {
    subtopic.claims.forEach((claim) => {
      claim.quotes.forEach((quote) => {
        people.add(quote.authorId);
      });
    });
  });
  return people.size;
};

const TopicItem = ({ data }: { data: TTopic }) => {
  const totalClaims = data.subtopics.reduce((acc, subtopic) => {
    return acc + subtopic.claims.length;
  }, 0);
  const totalPeople = calculateTotalPeople(data);
  return (
    <div className="p-3 flex flex-col md:flex-row gap-3">
      <div className="flex-1">
        <ClaimBoxes data={data} />
      </div>
      <div className="flex-1">
        <h4 className="font-bold">{data.title}</h4>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MessageCircle className="size-4" /> {totalClaims} claims by{" "}
          {totalPeople} people.
        </div>
        <p className="text-sm mt-2">{data.description}</p>
        <b className="text-sm font-bold">Subtopics:&nbsp;</b>
        {data.subtopics.map((subtopic, index) => {
          if (index > 4) return null;
          return (
            <ClaimPopup
              key={index}
              data={subtopic.claims[0]}
              asChild
              trigger={
                <a
                  key={subtopic.title}
                  className="text-sm hover:underline mr-1"
                  style={{
                    color: `rgb(${TopicColors[data.colorIndex]})`,
                  }}
                  href="#"
                >
                  {subtopic.title}
                  {index < data.subtopics.length - 1 && ","}
                </a>
              }
            />
          );
        })}
        {data.subtopics.length > 4 && (
          <a
            className="rounded-full flex items-center gap-1 text-primary text-sm underline"
            href="#"
          >
            View all subtopics
          </a>
        )}
      </div>
    </div>
  );
};

export default TopicItem;
