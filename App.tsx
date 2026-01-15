
import React, { useState, useEffect } from 'react';
import Landing from './views/Landing';
import Wizard from './views/Wizard';
import Results from './views/Results';
import Admin from './views/Admin';
import { TestimonialEntry } from './types';

type Page = 'landing' | 'wizard' | 'results' | 'admin';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);

  // Simple hash-based "routing" to satisfy environment requirements
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['landing', 'wizard', 'results', 'admin'].includes(hash)) {
        setCurrentPage(hash as Page);
      } else if (hash.startsWith('results/')) {
        const id = hash.split('/')[1];
        setActiveEntryId(id);
        setCurrentPage('results');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page: Page, id?: string) => {
    if (id) {
      window.location.hash = `${page}/${id}`;
    } else {
      window.location.hash = page;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => navigate('landing')}
          >
            <div className="w-8 h-8 bg-[#FF5136] rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">Mimosa</span>
          </div>
          <nav className="flex items-center space-x-6">
            <button 
              onClick={() => navigate('wizard')} 
              className="text-sm font-medium text-slate-600 hover:text-[#FF5136] transition"
            >
              New Entry
            </button>
            <button 
              onClick={() => navigate('admin')} 
              className="text-sm font-medium text-slate-600 hover:text-[#FF5136] transition"
            >
              Dashboard
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentPage === 'landing' && <Landing onStart={() => navigate('wizard')} />}
        {currentPage === 'wizard' && (
          <Wizard 
            onComplete={(id) => navigate('results', id)} 
            onCancel={() => navigate('landing')}
          />
        )}
        {currentPage === 'results' && activeEntryId && (
          <Results 
            entryId={activeEntryId} 
            onEdit={() => navigate('wizard')}
            onBackToDashboard={() => navigate('admin')}
          />
        )}
        {currentPage === 'admin' && (
          <Admin 
            onView={(id) => navigate('results', id)} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">© 2024 Mimosa Workshops. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
