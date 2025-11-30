
import React from 'react';
import { GeneratedPage, AppState } from '../types';

interface ArticleViewProps {
  page: GeneratedPage;
  onNavigate: (view: AppState) => void;
  onViewCategory: (category: string) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({ page, onNavigate, onViewCategory }) => {
  return (
    <article className="bg-bg min-h-screen pb-16">
      
      {/* AdSense Leaderboard Placeholder */}
      <div className="w-full bg-white border-b border-gray-200 py-4 mb-8 flex justify-center">
        <div className="w-[728px] h-[90px] bg-gray-100 flex flex-col items-center justify-center text-gray-400 text-xs tracking-widest uppercase border border-dashed border-gray-300">
          <span>Advertisement</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Content */}
        <div className="lg:col-span-8 bg-white p-8 md:p-12 shadow-sm rounded-lg border border-gray-200">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center text-xs font-sans font-semibold text-secondary uppercase tracking-wider mb-8">
            <span onClick={() => onNavigate(AppState.HOME)} className="cursor-pointer hover:text-primary">Home</span>
            <span className="mx-2 text-gray-300">/</span>
            <span onClick={() => onViewCategory(page.category)} className="cursor-pointer text-accent hover:underline">{page.category}</span>
          </nav>

          {/* Header */}
          <header className="mb-10 border-b border-gray-100 pb-10">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-6 leading-tight">
              {page.title}
            </h1>
            
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-serif font-bold text-lg">
                  {page.author.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">{page.author}</div>
                  <div className="text-xs text-secondary uppercase tracking-wide">Senior Market Analyst</div>
                </div>
              </div>
              
              <div className="text-sm text-gray-500 font-sans">
                <span className="block">Published: <time>{page.publishDate}</time></span>
                <span className="block">Updated: <time>{page.lastUpdated}</time></span>
              </div>
            </div>
          </header>

          {/* Introduction Summary */}
          <div className="bg-gray-50 p-6 rounded-l border-l-4 border-accent mb-10">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wide mb-2">Executive Summary</h3>
            <p className="font-serif text-lg leading-relaxed text-gray-800 italic">
              {page.summary}
            </p>
          </div>

          {/* Article Body */}
          <div 
            className="prose prose-lg max-w-none prose-headings:font-sans prose-headings:font-bold prose-headings:text-primary prose-p:font-serif prose-p:text-gray-700 prose-p:leading-loose prose-li:font-serif prose-li:text-gray-700 prose-strong:text-primary prose-a:text-accent prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: page.htmlContent }}
          />

          {/* In-Article Ad */}
          <div className="my-12 p-8 bg-gray-50 border border-gray-100 flex justify-center">
            <div className="text-center">
              <span className="text-xs text-gray-400 uppercase tracking-widest block mb-2">Advertisement</span>
              <div className="w-[300px] h-[250px] bg-gray-200 mx-auto"></div>
            </div>
          </div>

          {/* Data Table */}
          <div className="mt-12 mb-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans font-bold text-xl text-primary">{page.dataBox.title}</h3>
              <button className="text-xs font-bold text-accent uppercase tracking-wider border border-accent px-3 py-1 rounded hover:bg-accent hover:text-white transition-colors">
                Download CSV
              </button>
            </div>
            <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {page.dataBox.headers.map((h, i) => (
                      <th key={i} className="px-6 py-3 text-left text-xs font-bold text-secondary uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {page.dataBox.rows.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      {row.map((cell, c) => (
                        <td key={c} className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-500 text-right">Source: {page.dataBox.source} & Equinox Data Aggregation</p>
          </div>

          {/* FAQ Section */}
          <section className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-sans font-bold text-primary mb-8">Frequently Asked Questions</h2>
            <div className="space-y-8">
              {page.faq.map((item, i) => (
                <div key={i} className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{item.question}</h3>
                  <p className="text-gray-700 font-serif leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Author Bio Box */}
          <div className="mt-16 bg-white border border-gray-200 p-8 flex gap-6 items-start rounded-lg shadow-sm">
             <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-serif font-bold flex-shrink-0">
               {page.author.charAt(0)}
             </div>
             <div>
               <h4 className="text-lg font-sans font-bold text-gray-900">About {page.author}</h4>
               <p className="text-sm text-gray-600 mt-2 font-serif">
                 Senior Market Analyst at Equinox Analytics. Specializing in macro-economic trends and regional cost-of-living analysis. Dedicated to providing transparent data for global decision makers.
               </p>
             </div>
          </div>

        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          
          {/* Sidebar Ad */}
          <div className="bg-white p-4 border border-gray-200 shadow-sm flex flex-col items-center">
             <span className="text-xs text-gray-300 uppercase tracking-widest mb-2">Advertisement</span>
             <div className="w-[300px] h-[600px] bg-gray-100"></div>
          </div>

          {/* Key Facts Widget */}
          <div className="bg-primary text-white p-6 rounded shadow-lg">
            <h3 className="font-sans font-bold text-lg mb-6 border-b border-white/20 pb-4">Quick Insights</h3>
            <ul className="space-y-4">
              {page.sidebarFacts.map((fact, i) => (
                <li key={i} className="flex gap-4">
                  <span className="text-accent font-mono font-bold text-lg">0{i+1}</span>
                  <p className="text-sm font-sans text-gray-200 leading-snug">{fact}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Related Articles */}
          <div className="bg-white p-6 border border-gray-200 rounded shadow-sm">
             <h3 className="font-sans font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Related Analysis</h3>
             <ul className="space-y-4">
               {page.internalLinks.map((link, i) => (
                 <li key={i} className="group">
                   <a href="#" className="block">
                     <h4 className="text-sm font-bold text-gray-800 group-hover:text-accent transition-colors leading-snug mb-1">{link.title}</h4>
                     <span className="text-xs text-gray-400 uppercase">Read Report →</span>
                   </a>
                 </li>
               ))}
             </ul>
          </div>
        </aside>

      </div>
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(page.schema) }}
      />
    </article>
  );
};