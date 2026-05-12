import React from 'react';
import { YearLevel, Subject, starterCardsConfig, isYearLevel } from '../lib/curriculumConfig';

interface Props {
  yearLevel: YearLevel;
  subject: Subject;
  onSelect: (prompt: string) => void;
}

export default function StarterCards({ yearLevel, subject, onSelect }: Props) {
  if (!isYearLevel(yearLevel)) return null;
  const cards = starterCardsConfig[subject]?.[yearLevel];
  if (!cards) return null;

  return (
    <div className="grid grid-cols-3 gap-3 w-full">
      {cards.map(card => (
        <button
          key={card.title}
          onClick={() => onSelect(card.prompt)}
          className="group text-left p-4 rounded-2xl bg-gray-800/60 hover:bg-gray-700/70 border border-gray-700/50 hover:border-blue-500/40 hover:shadow-[0_0_18px_rgba(59,130,246,0.12)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.99]"
        >
          <div className="text-2xl mb-2">{card.emoji}</div>
          <p className="text-sm font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors">
            {card.title}
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">{card.description}</p>
        </button>
      ))}
    </div>
  );
}
