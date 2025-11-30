import React from 'react';
import { GeneratedPage, AppState } from '../types';

interface CategoryPageProps {
  category: string;
  pages: GeneratedPage[];
  onViewPage: (page: GeneratedPage) => void;
  onNavigate: (view: AppState) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ category, pages, onViewPage, onNavigate }) => {
  const categoryPages = pages.filter(p => p.category === category);

  return (
    <div className="min-h-screen bg-bg pb-20">
      <div className="bg-primary text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
             <div className="text-sm font-bold uppercase tracking-widest text-accent mb-2 cursor-pointer hover:underline" onClick={() => onNavigate(AppState.HOME)}>← Back to Home</div>
             <h1 className="text-4xl md:text-5xl font-serif font-bold">{category}</h1>
             <p className="text-gray-300 mt-4 max-w-2xl font-sans">
               Browse our latest research and data analysis regarding {category.toLowerCase()}.
             </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {categoryPages.length === 0 ? (
          <div className="bg-white p-12 text-center rounded border border-gray-200">
             <p className="text-gray-500 font-serif text-lg">No reports found in this category yet.</p>
             <button onClick={() => onNavigate(AppState.ADMIN_DASHBOARD)} className="mt-4 text-primary underline text-sm font-bold uppercase tracking-wide">Generate Content</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {categoryPages.map(page => (
               <div key={page.id} onClick={() => onViewPage(page)} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group cursor-pointer hover:shadow-md transition-all">
                  <div className="p-6">
                    <div className="text-xs font-bold text-accent uppercase mb-2">{page.category}</div>
                    <h3 className="font-serif font-bold text-xl text-primary mb-3 group-hover:text-accent transition-colors">
                      {page.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 font-sans">
                      {page.summary}
                    </p>
                     <div className="text-xs text-gray-400 font-sans border-t border-gray-100 pt-4 flex justify-between">
                      <span>{page.publishDate}</span>
                      <span>By {page.author}</span>
                    </div>
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};