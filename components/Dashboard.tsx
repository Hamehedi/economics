
import React, { useState } from 'react';
import { generateKeywordQueue, generateInternalLinks } from '../services/seoEngine';
import { generatePageContent } from '../services/gemini';
import { GeneratedPage } from '../types';

interface DashboardProps {
  pages: GeneratedPage[];
  onPageCreated: (page: GeneratedPage) => void;
  onViewPage: (page: GeneratedPage) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ pages, onPageCreated, onViewPage }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [targetRegion, setTargetRegion] = useState('Global');

  const handleBulkGenerate = async () => {
    setIsGenerating(true);
    setLogs(prev => ["Initializing Content Engine v2.1...", ...prev]);
    
    const queue = generateKeywordQueue(5); 
    setLogs(prev => [`Generated ${queue.length} high-value topics for region: ${targetRegion}.`, ...prev]);

    for (const keyword of queue) {
      setLogs(prev => [`[ANALYZER] Researching: "${keyword}"`, ...prev]);
      try {
        const newPage = await generatePageContent(keyword);
        
        // Link Logic
        newPage.internalLinks = generateInternalLinks(newPage, [...pages, newPage]);
        
        onPageCreated(newPage);
        setLogs(prev => [`[PUBLISHER] Success: ${newPage.title}`, ...prev]);
      } catch (e) {
        setLogs(prev => [`[ERROR] Failed to generate ${keyword}`, ...prev]);
      }
    }
    
    setIsGenerating(false);
    setLogs(prev => ["Batch operation complete. Index updated.", ...prev]);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-primary">Equinox CMS <span className="text-gray-400 font-normal text-lg">| Content Engine</span></h1>
          <div className="flex gap-4">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-600"></span> System Online
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
               <h3 className="font-bold text-gray-900 mb-4">Generator Configuration</h3>
               
               <div className="space-y-4 mb-6">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Target Region</label>
                   <select 
                      value={targetRegion}
                      onChange={(e) => setTargetRegion(e.target.value)}
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                   >
                     <option>Global (Mixed)</option>
                     <option>North America (High CPM)</option>
                     <option>Europe</option>
                     <option>APAC</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Content Mode</label>
                   <select className="w-full border border-gray-300 rounded p-2 text-sm" disabled>
                     <option>Deep Analysis (Slow)</option>
                     <option>News Brief</option>
                   </select>
                 </div>
               </div>

               <button
                onClick={handleBulkGenerate}
                disabled={isGenerating}
                className={`w-full py-3 px-4 rounded text-sm font-bold uppercase tracking-wide text-white transition-all ${isGenerating ? 'bg-secondary cursor-not-allowed' : 'bg-primary hover:bg-slate-800 shadow-lg hover:shadow-xl'}`}
              >
                {isGenerating ? 'Running Engine...' : 'Run Auto-Generator'}
              </button>
            </div>

            {/* Console */}
            <div className="bg-gray-900 rounded-lg p-4 h-[400px] overflow-y-auto font-mono text-xs shadow-inner">
              <div className="text-gray-500 border-b border-gray-700 pb-2 mb-2">System Logs</div>
              {logs.length === 0 && <div className="text-gray-600 italic">Ready to process...</div>}
              {logs.map((log, i) => (
                <div key={i} className="mb-1">
                  <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> <span className="text-green-400">{log}</span>
                </div>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-700">Published Content ({pages.length})</h3>
                <button className="text-xs text-accent font-bold uppercase">Export Sitemap</button>
              </div>
              <ul className="divide-y divide-gray-100">
                {pages.map((page) => (
                  <li key={page.id} className="hover:bg-blue-50/50 transition-colors">
                    <button 
                      onClick={() => onViewPage(page)}
                      className="w-full text-left px-6 py-4 flex justify-between items-center"
                    >
                      <div>
                        <div className="font-bold text-primary text-sm mb-1">{page.title}</div>
                        <div className="text-xs text-gray-500 flex gap-2">
                           <span>/{page.slug}</span>
                           <span>•</span>
                           <span>{page.category}</span>
                        </div>
                      </div>
                      <div className="text-right">
                         <div className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">LIVE</div>
                      </div>
                    </button>
                  </li>
                ))}
                {pages.length === 0 && (
                  <li className="px-6 py-8 text-center text-gray-400 italic">No content in database.</li>
                )}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
