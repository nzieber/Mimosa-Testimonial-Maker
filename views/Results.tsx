
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { TestimonialEntry } from '../types';

interface ResultsProps {
  entryId: string;
  onEdit: () => void;
  onBackToDashboard: () => void;
}

const Results: React.FC<ResultsProps> = ({ entryId, onEdit, onBackToDashboard }) => {
  const [entry, setEntry] = useState<TestimonialEntry | null>(null);
  const [activeTab, setActiveTab] = useState<'blog' | 'linkedin' | 'x' | 'email'>('blog');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const data = storageService.getEntryById(entryId);
    if (data) setEntry(data);
  }, [entryId]);

  const handleCopy = () => {
    if (!entry?.generatedOutputs) return;
    let textToCopy = "";
    
    switch(activeTab) {
      case 'blog': textToCopy = `# ${entry.generatedOutputs.blogPost.title}\n\n${entry.generatedOutputs.blogPost.content}`; break;
      case 'linkedin': textToCopy = entry.generatedOutputs.linkedIn.content; break;
      case 'x': textToCopy = entry.generatedOutputs.twitterThread.tweets.join('\n\n---\n\n'); break;
      case 'email': textToCopy = `Subjects: ${entry.generatedOutputs.email.subjects.join(' / ')}\n\n${entry.generatedOutputs.email.content}`; break;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!entry || !entry.generatedOutputs) return <div className="p-20 text-center">Loading results...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Testimonial Suite</h1>
          <p className="text-slate-500">Review and refine your drafts below.</p>
        </div>
        <div className="flex space-x-3">
            <button onClick={onBackToDashboard} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition font-medium">
                Dashboard
            </button>
            <button onClick={onEdit} className="px-4 py-2 bg-white border border-[#FFCCC4] text-[#FF5136] rounded-lg hover:bg-[#FFF5F3] transition font-medium">
                Edit Inputs
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
            <TabButton 
                active={activeTab === 'blog'} 
                onClick={() => setActiveTab('blog')} 
                icon="fa-newspaper" 
                label="Personal Blog" 
                sub="Long-form narrative"
            />
            <TabButton 
                active={activeTab === 'linkedin'} 
                onClick={() => setActiveTab('linkedin')} 
                icon="fa-brands fa-linkedin" 
                label="LinkedIn Post" 
                sub="Professional network"
            />
            <TabButton 
                active={activeTab === 'x'} 
                onClick={() => setActiveTab('x')} 
                icon="fa-brands fa-x-twitter" 
                label="X.com Thread" 
                sub="5-10 tweets"
            />
            <TabButton 
                active={activeTab === 'email'} 
                onClick={() => setActiveTab('email')} 
                icon="fa-envelope" 
                label="Referral Email" 
                sub="Direct outreach"
            />
        </div>

        {/* Content Viewer */}
        <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {activeTab.toUpperCase()} CONTENT
                    </span>
                    <button 
                        onClick={handleCopy}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-bold transition ${copied ? 'bg-green-100 text-green-700' : 'bg-[#FF5136] text-white hover:bg-[#E64930]'}`}
                    >
                        <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                        <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                    </button>
                </div>

                <div className="p-8 md:p-10 prose prose-slate max-w-none">
                    {activeTab === 'blog' && (
                        <>
                            <h2 className="text-2xl font-bold mb-6 text-[#FF5136] tracking-tight">{entry.generatedOutputs.blogPost.title}</h2>
                            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-lg">
                                {entry.generatedOutputs.blogPost.content}
                            </div>
                        </>
                    )}

                    {activeTab === 'linkedin' && (
                        <div className="whitespace-pre-wrap font-sans text-slate-800 leading-relaxed text-lg">
                            {entry.generatedOutputs.linkedIn.content}
                        </div>
                    )}

                    {activeTab === 'x' && (
                        <div className="space-y-6">
                            {entry.generatedOutputs.twitterThread.tweets.map((tweet, i) => (
                                <div key={i} className="flex space-x-4">
                                    <div className="flex-shrink-0 flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                                            {i + 1}
                                        </div>
                                        {i < entry.generatedOutputs!.twitterThread.tweets.length - 1 && (
                                            <div className="w-0.5 h-full bg-slate-100 my-1"></div>
                                        )}
                                    </div>
                                    <div className="flex-grow p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-800 leading-relaxed">
                                        {tweet}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'email' && (
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subject Lines</label>
                                <div className="flex flex-wrap gap-2">
                                    {entry.generatedOutputs.email.subjects.map((sub, i) => (
                                        <div key={i} className="px-3 py-2 bg-[#FFF5F3] text-[#FF5136] rounded-lg text-sm font-medium border border-[#FFCCC4]">
                                            {sub}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="whitespace-pre-wrap text-slate-800 leading-relaxed text-lg">
                                {entry.generatedOutputs.email.content}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-start space-x-4">
                <i className="fa-solid fa-lightbulb text-amber-500 mt-1"></i>
                <p className="text-sm text-amber-800">
                    <strong>Tip:</strong> You can edit the inputs to regenerate with a different tone or specific metrics. AI-generated content may require small tweaks to match your personal voice perfectly.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: string, label: string, sub: string }> = ({ active, onClick, icon, label, sub }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center space-x-4 p-4 rounded-2xl text-left border transition-all ${active ? 'bg-[#FF5136] border-[#FF5136] text-white shadow-lg shadow-[#FF5136]/10' : 'bg-white border-slate-100 text-slate-600 hover:border-[#FF5136]/30'}`}
    >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${active ? 'bg-white/20' : 'bg-slate-50 text-slate-400'}`}>
            <i className={icon}></i>
        </div>
        <div>
            <div className="font-bold text-sm tracking-tight">{label}</div>
            <div className={`text-[10px] uppercase font-bold tracking-wider ${active ? 'text-white/70' : 'text-slate-400'}`}>{sub}</div>
        </div>
    </button>
);

export default Results;
