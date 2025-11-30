import React, { useState, useEffect, useRef } from 'react';
import { GeneratedPage, AppState } from './types';
import { ArticleView } from './components/ArticleView';
import { Dashboard } from './components/Dashboard';
import { Home } from './components/Home';
import { CategoryPage } from './components/CategoryPage';
import { PrivacyPolicy, TermsOfService } from './components/StaticPages';
import { generateKeywordQueue, generateInternalLinks } from './services/seoEngine';
import { generatePageContent } from './services/gemini';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  
  // PERSISTENCE LAYER: Initialize state from LocalStorage if available
  const [pages, setPages] = useState<GeneratedPage[]>(() => {
    try {
      const saved = localStorage.getItem('equinox_content_db');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load save data", e);
      return [];
    }
  });

  const [currentPage, setCurrentPage] = useState<GeneratedPage | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  
  // Automation State
  const initializationRef = useRef(false);

  // PERSISTENCE LAYER: Save to LocalStorage whenever pages change
  useEffect(() => {
    localStorage.setItem('equinox_content_db', JSON.stringify(pages));
  }, [pages]);

  // AUTOMATION ENGINE: Runs on mount to populate site if empty
  useEffect(() => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    const autoPublish = async () => {
      // If we already have content (from LocalStorage), don't auto-generate
      if (pages.length > 0) {
        console.log("System initialized with saved content.");
        return;
      }

      console.log("AUTO-PUBLISHER: Database empty. Starting initialization sequence...");
      
      // Generate queue of 5 high-value starter articles
      const starterKeywords = generateKeywordQueue(5);
      let tempPages: GeneratedPage[] = [];

      // Process in sequence to ensure linking works somewhat
      for (const keyword of starterKeywords) {
        try {
          const newPage = await generatePageContent(keyword);
          newPage.internalLinks = generateInternalLinks(newPage, tempPages); // Link to previous pages in this batch
          
          tempPages.push(newPage);
          setPages(prev => [newPage, ...prev]); // Update UI incrementally
        } catch (e) {
          console.error("Auto-publisher failed for item:", keyword, e);
        }
      }
      console.log("AUTO-PUBLISHER: Initialization complete.");
    };

    autoPublish();
  }, []); // Run once on mount

  const handlePageCreated = (newPage: GeneratedPage) => {
    setPages(prev => [newPage, ...prev]);
  };

  const handleViewPage = (page: GeneratedPage) => {
    setCurrentPage(page);
    setAppState(AppState.VIEW_PAGE);
    window.scrollTo(0, 0);
  };

  const handleViewCategory = (category: string) => {
    setCurrentCategory(category);
    setAppState(AppState.CATEGORY_VIEW);
    window.scrollTo(0, 0);
  };

  // Nav Logic
  const handleNavClick = (section: string) => {
    if (section === 'ANALYSIS') {
      setAppState(AppState.HOME);
    } else if (section === 'DATASETS') {
      // Show Cost of Living as it's data-heavy
      handleViewCategory('Cost of Living');
    } else if (section === 'MARKETS') {
      // Show Economics
      handleViewCategory('Economics');
    }
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.HOME:
        return <Home onNavigate={setAppState} onViewPage={handleViewPage} onViewCategory={handleViewCategory} pages={pages} />;
      case AppState.VIEW_PAGE:
        return currentPage ? <ArticleView page={currentPage} onNavigate={setAppState} onViewCategory={handleViewCategory} /> : null;
      case AppState.CATEGORY_VIEW:
        return currentCategory ? <CategoryPage category={currentCategory} pages={pages} onViewPage={handleViewPage} onNavigate={setAppState} /> : null;
      case AppState.ADMIN_DASHBOARD:
        return <Dashboard pages={pages} onPageCreated={handlePageCreated} onViewPage={handleViewPage} />;
      case AppState.PRIVACY_POLICY:
        return <PrivacyPolicy />;
      case AppState.TERMS_OF_SERVICE:
        return <TermsOfService />;
      default:
        return <Home onNavigate={setAppState} onViewPage={handleViewPage} onViewCategory={handleViewCategory} pages={pages} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-900">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => setAppState(AppState.HOME)}>
              <div className="w-10 h-10 bg-primary text-white flex items-center justify-center font-serif font-bold text-2xl rounded mr-3 shadow-md">
                E
              </div>
              <div>
                <span className="font-serif font-bold text-xl tracking-tight text-primary block leading-none">
                  Equinox
                </span>
                <span className="font-sans text-xs tracking-widest text-secondary uppercase block">
                  Analytics
                </span>
              </div>
            </div>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => handleNavClick('ANALYSIS')} 
                className={`text-sm font-bold uppercase tracking-wide hover:text-accent transition-colors ${appState === AppState.HOME ? 'text-accent' : 'text-gray-500'}`}
              >
                Analysis
              </button>
              <button 
                onClick={() => handleNavClick('DATASETS')}
                className="text-sm font-bold uppercase tracking-wide text-gray-500 hover:text-accent transition-colors"
              >
                Datasets
              </button>
              <button 
                onClick={() => handleNavClick('MARKETS')}
                className="text-sm font-bold uppercase tracking-wide text-gray-500 hover:text-accent transition-colors"
              >
                Markets
              </button>
            </nav>

            {/* Admin Link (Hidden from public view - Access via secret gesture or URL in real app) */}
            <div>
               {/* Hidden for automation feel, but kept for dev access if needed */}
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white pt-16 pb-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            <div className="col-span-1 md:col-span-1">
              <h3 className="font-serif font-bold text-2xl mb-4">Equinox Analytics</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Providing verified, structured data for the global economy. Trusted by analysts and researchers worldwide.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest mb-6 text-accent">Sectors</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><button onClick={() => handleViewCategory('Economics')} className="hover:text-white">Economics</button></li>
                <li><button onClick={() => handleViewCategory('Demographics')} className="hover:text-white">Demographics</button></li>
                <li><button onClick={() => handleViewCategory('Real Estate')} className="hover:text-white">Real Estate</button></li>
                <li><button onClick={() => handleViewCategory('Technology')} className="hover:text-white">Technology</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest mb-6 text-accent">Company</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Methodology</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>

            <div>
               <h4 className="font-bold text-sm uppercase tracking-widest mb-6 text-accent">Legal</h4>
               <ul className="space-y-3 text-sm text-gray-300">
                 <li><button onClick={() => setAppState(AppState.PRIVACY_POLICY)} className="hover:text-white text-left">Privacy Policy</button></li>
                 <li><button onClick={() => setAppState(AppState.TERMS_OF_SERVICE)} className="hover:text-white text-left">Terms of Service</button></li>
                 <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
               </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-mono">
            <div>
              © 2024 Equinox Analytics Group. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0">
              New York • London • Singapore
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;