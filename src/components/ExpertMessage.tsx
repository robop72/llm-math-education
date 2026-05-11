import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface Props {
  text: string;
}

// Backend outputs: [Image of <description>]
const IMAGE_REGEX = /\[Image of ([^\]]+)\]/gi;

export default function ExpertMessage({ text }: Props) {
  const parts: { type: 'text' | 'image'; content: string }[] = [];
  let lastIndex = 0;
  let match;

  IMAGE_REGEX.lastIndex = 0;
  while ((match = IMAGE_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'image', content: match[1] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return (
    <div className="space-y-4">
      {parts.map((part, i) =>
        part.type === 'image' ? (
          <div key={i} className="my-4 text-center">
            <img
              src={`https://source.unsplash.com/featured/?${encodeURIComponent(part.content)},diagram,mathematics`}
              alt={part.content}
              className="max-w-full h-auto rounded-xl shadow-lg border border-gray-700 mx-auto"
            />
            <p className="text-xs text-gray-400 mt-2 italic">{part.content}</p>
          </div>
        ) : (
          <div key={i} className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {part.content}
            </ReactMarkdown>
          </div>
        )
      )}
    </div>
  );
}
