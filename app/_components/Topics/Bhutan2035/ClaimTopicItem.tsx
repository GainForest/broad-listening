import { MessageCircle } from "lucide-react";
import React from "react";
import ClaimPopup from "./ClaimPopup";
import ClaimBoxes from "./ClaimBoxes";

export const TopicColors = [
  [185, 28, 28], // red-700
  [194, 65, 12], // orange-700
  [180, 83, 9], // amber-700
  [161, 98, 7], // yellow-700
  [101, 163, 13], // lime-700
  [21, 128, 61], // green-700
  [4, 120, 87], // emerald-700
  [15, 118, 110], // teal-700
  [14, 116, 144], // cyan-700
  [2, 132, 199], // sky-700
  [29, 78, 216], // blue-700
  [67, 56, 202], // indigo-700
  [109, 40, 217], // violet-700
  [126, 34, 206], // purple-700
  [192, 38, 211], // fuchsia-700
  [190, 24, 93], // pink-700
  [190, 18, 60], // rose-700
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
              colorIndex={data.colorIndex}
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
