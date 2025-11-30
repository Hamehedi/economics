import React from 'react';
import { AppState, GeneratedPage } from '../types';

interface HomeProps {
  onNavigate: (view: AppState) => void;
  onViewPage: (page: GeneratedPage) => void;
  onViewCategory: (category: string) => void;
  pages: GeneratedPage[];
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onViewPage, onViewCategory, pages }) => {
  // STRICTLY TEXT-ONLY CATEGORIES - High-End Editorial Look
  const categories = [
    { name: "Cost of Living", description: "CPI, purchasing power parity & inflation indices by region." },
    { name: "Economics", description: "GDP growth, trade balances, and sovereign debt analysis." },
    { name: "Demographics", description: "Population pyramids, migration flows & census projections." },
    { name: "Technology", description: "Digital infrastructure, broadband adoption & innovation rates." },
    { name: "Real Estate", description: "Housing market trends, rental yields & commercial property." },
    { name: "Quality of Life", description: "Healthcare efficiency, safety indices & pollution metrics." }
  ];

  const featured = pages.slice(0, 3);
  const trending = pages.slice(3, 9);

  return (
    <div className="min-h-screen bg-bg font-sans">
      
      {/* Hero Section */}
      <section className="bg-primary text-white pt-24 pb-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
           <svg width="100%" height="100%">
             <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
               <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
             </pattern>
             <rect width="100%" height="100%" fill="url(#grid)" />
           </svg>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-accent font-sans font-bold tracking-widest text-xs uppercase mb-4 block opacity-90">
            Global Market Intelligence
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight leading-tight">
            Verified Data for a <br/> Complex World
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-sans mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Access structured economic insights, demographic shifts, and market forecasts across 150+ countries.
          </p>
          
          <div className="max-w-2xl mx-auto relative shadow-2xl rounded-lg">
            <input 
              type="text" 
              placeholder="Search analysis (e.g., 'Inflation in Germany')..." 
              className="w-full pl-6 pr-36 py-5 rounded-lg text-gray-900 font-sans focus:outline-none border-0 ring-1 ring-white/10"
            />
            <button className="absolute right-2 top-2 bottom-2 bg-accent text-white px-6 rounded-md font-bold hover:bg-yellow-600 transition-colors uppercase text-xs tracking-wider">
              Search Data
            </button>
          </div>
        </div>
      </section>

      {/* Categories - Editorial Text Layout (No Icons) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
          {categories.map((cat, i) => (
            <div 
              key={i} 
              onClick={() => onViewCategory(cat.name)}
              className="group p-8 cursor-pointer border-b border-r border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-serif font-bold text-xl text-primary mb-2 group-hover:text-accent transition-colors flex items-center justify-between">
                {cat.name}
                <span className="opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-sm">→</span>
              </h3>
              <p className="text-sm text-gray-500 font-sans leading-relaxed">
                {cat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Analysis */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-4">
          <h2 className="text-3xl font-serif font-bold text-primary">Latest Intelligence</h2>
          <a href="#" className="text-sm font-bold text-accent uppercase tracking-wider hover:text-primary transition-colors">View Archive</a>
        </div>
        
        {pages.length === 0 ? (
          <div className="py-24 bg-white rounded border border-gray-200 flex flex-col items-center justify-center text-center px-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-900 font-bold mb-2">Initializing Global Data Stream...</p>
            <p className="text-gray-500 text-sm max-w-md">
              The automated publisher is currently generating fresh market analysis. New reports will appear here automatically in a few seconds.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map(page => (
              <div key={page.id} onClick={() => onViewPage(page)} className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
                <div className="h-56 bg-gray-100 flex items-center justify-center text-secondary relative overflow-hidden">
                   <div className="absolute inset-0 bg-primary opacity-5"></div>
                   <div className="text-center p-6">
                      <span className="font-serif italic text-4xl text-gray-300 block mb-2">E</span>
                      <span className="text-xs font-bold uppercase tracking-widest text-accent border border-accent/30 px-2 py-1 bg-white/50">{page.category}</span>
                   </div>
                </div>
                <div className="p-8">
                  <h3 className="font-serif font-bold text-xl text-primary mb-3 group-hover:text-accent transition-colors leading-snug">
                    {page.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-6 font-light leading-relaxed">
                    {page.summary}
                  </p>
                  <div className="text-xs text-gray-400 font-sans border-t border-gray-100 pt-4 flex justify-between items-center">
                    <span className="font-semibold text-gray-500">{page.publishDate}</span>
                    <span className="uppercase tracking-wide">By {page.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Trending List */}
      <section className="bg-white py-24 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-2xl font-serif font-bold text-primary mb-12 text-center">Trending Reports</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
             {trending.length > 0 ? trending.map(page => (
               <div key={page.id} onClick={() => onViewPage(page)} className="flex gap-4 cursor-pointer group items-start border-b border-gray-100 pb-4 md:border-0 md:pb-0">
                 <div className="text-xl text-accent font-serif font-bold mt-1">
                   &rarr;
                 </div>
                 <div>
                   <h4 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors font-serif">{page.title}</h4>
                   <span className="text-xs text-gray-400 uppercase tracking-widest group-hover:text-accent transition-colors">Read Analysis</span>
                 </div>
               </div>
             )) : (
               <div className="col-span-3 text-center text-gray-400 font-light italic">Gathering trending metrics...</div>
             )}
           </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-primary text-white py-24 text-center border-t border-white/10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold mb-4">Market Watch Newsletter</h2>
          <p className="text-gray-400 mb-10 font-sans text-lg font-light">
            Get weekly executive summaries, dataset updates, and global market signals delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <input 
              type="email" 
              placeholder="Enter your professional email" 
              className="px-6 py-4 rounded text-gray-900 w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button className="bg-accent text-white font-bold px-8 py-4 rounded hover:bg-yellow-600 transition-colors uppercase tracking-widest text-xs">
              Subscribe
            </button>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

    </div>
  );
};