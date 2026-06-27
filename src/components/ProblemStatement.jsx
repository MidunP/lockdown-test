import React from 'react';
import { Award, Layers } from 'lucide-react';

const markdownToHtml = (md) => {
  if (!md) return '';
  
  // Basic markdown sanitizer / formatter for clean visual rendering
  let html = md;
  
  // Format Code blocks first to avoid interference
  html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
    // Escape standard HTML tags inside code
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<pre class="bg-dark-950/80 border border-dark-850/80 text-dark-200 font-mono text-xs md:text-sm p-4 rounded-xl my-4 overflow-x-auto whitespace-pre font-light">${escapedCode.trim()}</pre>`;
  });

  // Headings
  html = html.replace(/^### (.*$)/gim, '<h4 class="text-sm font-bold uppercase tracking-wider text-primary-400 mt-6 mb-2">$1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h3 class="text-lg font-bold text-white mt-6 mb-3">$1</h3>');
  html = html.replace(/^# (.*$)/gim, '<h2 class="text-2xl font-extrabold text-white mt-8 mb-4">$1</h2>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
  
  // Italics
  html = html.replace(/\*(.*?)\*/g, '<em class="text-dark-200">$1</em>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-dark-900 border border-dark-800 text-primary-300 font-mono text-xs px-1.5 py-0.5 rounded-md">$1</code>');
  
  // Bullet lists
  html = html.replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc text-dark-300 mb-1">$1</li>');
  html = html.replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-dark-300 mb-1">$1</li>');
  
  // Handle double line breaks as paragraphs
  html = html.split('\n\n').map(p => {
    if (p.trim().startsWith('<pre') || p.trim().startsWith('<h') || p.trim().startsWith('<li')) {
      return p;
    }
    return `<p class="text-dark-300 leading-relaxed mb-4 text-sm md:text-base">${p}</p>`;
  }).join('\n');

  // Convert single line breaks to br outside lists
  html = html.replace(/(?:\r\n|\r|\n)/g, '<br />');
  
  // Remove empty tags and double line break artifacts
  html = html.replace(/<br \/><li/g, '<li');
  html = html.replace(/<\/li><br \/>/g, '</li>');
  html = html.replace(/<br \/><h/g, '<h');
  html = html.replace(/<br \/><pre/g, '<pre');
  html = html.replace(/<\/pre><br \/>/g, '</pre>');

  return html;
};

export const ProblemStatement = ({ problem }) => {
  if (!problem) return null;

  const difficultyColors = {
    Easy: 'bg-emerald-950 text-emerald-300 border-emerald-800/40',
    Medium: 'bg-yellow-950 text-yellow-300 border-yellow-800/40',
    Hard: 'bg-rose-950 text-rose-300 border-rose-800/40'
  };

  const htmlContent = markdownToHtml(problem.description);

  return (
    <div className="h-full overflow-y-auto px-6 py-6 flex flex-col space-y-6">
      {/* Header details */}
      <div className="border-b border-dark-800/60 pb-4 space-y-3">
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${difficultyColors[problem.difficulty] || 'bg-dark-900 text-dark-300'}`}>
            <Layers className="mr-1 h-3 w-3" />
            {problem.difficulty}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-dark-900 text-primary-300 border border-dark-800">
            <Award className="mr-1 h-3 w-3 text-primary-400" />
            {problem.points} Points
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white m-0 tracking-tight">{problem.title}</h2>
      </div>

      {/* Main rendered text */}
      <article 
        className="prose prose-invert max-w-none text-dark-300"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
};
