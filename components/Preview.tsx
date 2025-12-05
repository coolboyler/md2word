import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface PreviewProps {
  content: string;
}

export const Preview: React.FC<PreviewProps> = ({ content }) => {
  return (
    <div className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-indigo-600 prose-img:rounded-lg">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Override links to open in new tab
          a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};