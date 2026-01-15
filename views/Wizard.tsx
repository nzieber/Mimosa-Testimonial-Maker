
import React, { useState } from 'react';
import { TestimonialEntry, Tone, Length, CTAStyle } from '../types';
import { storageService } from '../services/storageService';
import { geminiService } from '../services/geminiService';

interface WizardProps {
  onComplete: (id: string) => void;
  onCancel: () => void;
}

const Wizard: React.FC<WizardProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<Partial<TestimonialEntry>>({
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    tone: Tone.PROFESSIONAL,
    length: Length.MEDIUM,
    ctaStyle: CTAStyle.SOFT,
    brandVoice: 'builder energy, optimistic, practical, no cringe',
    screenshots: [],
    anonymize: false,
    allowNameUse: true,
    consentToUse: true
  });

  const updateForm = (updates: Partial<TestimonialEntry>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'prd' | 'screenshot') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    (Array.from(files) as File[]).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (type === 'screenshot') {
          updateForm({ screenshots: [...(formData.screenshots || []), base64] });
        } else {
          updateForm({ prdFileUrl: base64 });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const finalEntry = formData as TestimonialEntry;
      const outputs = await geminiService.generateTestimonials(finalEntry);
      const entryWithOutputs = { ...finalEntry, generatedOutputs: outputs };
      storageService.saveEntry(entryWithOutputs);
      onComplete(entryWithOutputs.id);
    } catch (err) {
      console.error("Generation failed", err);
      alert("Something went wrong during generation. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 6));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  if (isGenerating) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="mb-8 relative flex justify-center">
            <div className="w-24 h-24 border-4 border-[#FFF5F3] border-t-[#FF5136] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-[#FF5136]">
                <i className="fa-solid fa-wand-magic-sparkles text-2xl"></i>
            </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Mimosa is building your story...</h2>
        <p className="text-slate-500">We're weaving your insights into 4 different formats. This usually takes 10-20 seconds.</p>
        <div className="mt-8 space-y-4 text-left bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div className="flex items-center space-x-3 text-sm text-slate-600">
                <i className="fa-solid fa-check text-green-500"></i>
                <span>Analyzing workshop outputs...</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-slate-600">
                <i className="fa-solid fa-check text-green-500"></i>
                <span>Applying brand voice guidelines...</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-slate-600">
                <div className="w-2 h-2 bg-[#FF5136] rounded-full animate-pulse"></div>
                <span>Drafting social media strategy...</span>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-[#FF5136] uppercase tracking-wider">Step {step} of 6</span>
          <span className="text-xs text-slate-400">{Math.round((step / 6) * 100)}% Complete</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#FF5136] transition-all duration-500 ease-out" 
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10">
        
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">About You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF5136] focus:border-[#FF5136] outline-none transition"
                  placeholder="e.g. Jane Doe"
                  value={formData.participantName || ''}
                  onChange={(e) => updateForm({ participantName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Role Title</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF5136] focus:border-[#FF5136] outline-none transition"
                  placeholder="e.g. Senior Product Manager"
                  value={formData.roleTitle || ''}
                  onChange={(e) => updateForm({ roleTitle: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Company (Optional)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF5136] focus:border-[#FF5136] outline-none transition"
                  placeholder="e.g. Acme Corp"
                  value={formData.company || ''}
                  onChange={(e) => updateForm({ company: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Short Background Bio</label>
              <textarea 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF5136] focus:border-[#FF5136] outline-none transition"
                rows={3}
                placeholder="What did you do before the workshop? Any specific expertise?"
                value={formData.backgroundBio || ''}
                onChange={(e) => updateForm({ backgroundBio: e.target.value })}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Before the Workshop</h2>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">What were your main goals or pain points?</label>
              <textarea 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF5136] focus:border-[#FF5136] outline-none transition"
                rows={4}
                placeholder="e.g. I struggled with technical communication, or I wanted to learn how to build AI agents..."
                value={formData.goalsBeforeWorkshop || ''}
                onChange={(e) => updateForm({ goalsBeforeWorkshop: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Biggest Challenge</label>
              <textarea 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF5136] focus:border-[#FF5136] outline-none transition"
                rows={2}
                placeholder="What was the one thing you really needed to solve?"
                value={formData.biggestBreakthrough || ''}
                onChange={(e) => updateForm({ biggestBreakthrough: e.target.value })}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">What You Built</h2>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Brief Summary of Your Output</label>
              <textarea 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF5136] focus:border-[#FF5136] outline-none transition"
                rows={3}
                placeholder="e.g. A fully functional AI-powered project manager dashboard..."
                value={formData.whatTheyBuilt || ''}
                onChange={(e) => updateForm({ whatTheyBuilt: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Upload PRD or Document (Optional)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-[#FF5136] transition cursor-pointer relative">
                <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => handleFileChange(e, 'prd')}
                />
                <div className="space-y-1 text-center">
                  <i className="fa-solid fa-file-pdf text-3xl text-slate-400 mb-2"></i>
                  <div className="flex text-sm text-slate-600">
                    <span className="relative rounded-md font-medium text-[#FF5136] hover:text-[#E64930]">Upload a file</span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500">PDF, DOCX up to 10MB</p>
                </div>
              </div>
              {formData.prdFileUrl && (
                  <p className="mt-2 text-xs text-green-600 font-medium flex items-center">
                    <i className="fa-solid fa-circle-check mr-1"></i> File ready for analysis
                  </p>
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">How It Works</h2>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Describe the technical workflow or process</label>
              <textarea 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF5136] focus:border-[#FF5136] outline-none transition"
                rows={4}
                placeholder="Explain the steps, the tech stack used, or how the user interacts with it..."
                value={formData.howItWorks || ''}
                onChange={(e) => updateForm({ howItWorks: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Screenshots (Up to 3)</label>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {formData.screenshots?.map((s, idx) => (
                  <div key={idx} className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative">
                    <img src={s} className="w-full h-full object-cover" alt={`Screenshot ${idx + 1}`} />
                    <button 
                        onClick={() => updateForm({ screenshots: formData.screenshots?.filter((_, i) => i !== idx) })}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs shadow-lg"
                    >
                        <i className="fa-solid fa-times"></i>
                    </button>
                  </div>
                ))}
                {(formData.screenshots?.length || 0) < 3 && (
                   <div className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 cursor-pointer relative hover:border-[#FF5136] transition">
                      <input 
                        type="file" 
                        multiple 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={(e) => handleFileChange(e, 'screenshot')}
                      />
                      <i className="fa-solid fa-plus mb-1"></i>
                      <span className="text-[10px] font-bold uppercase">Add</span>
                   </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Impact & Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Metrics or Early Feedback</label>
                <textarea 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF5136] focus:border-[#FF5136] outline-none transition"
                  rows={3}
                  placeholder="e.g. Saved 4 hours/week, or 5 colleagues loved the prototype..."
                  value={formData.resultsMetrics || ''}
                  onChange={(e) => updateForm({ resultsMetrics: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Killer One-Sentence Quote</label>
                <textarea 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF5136] focus:border-[#FF5136] outline-none transition"
                  rows={3}
                  placeholder="If you could summarize the workshop in 1 punchy sentence..."
                  value={formData.quotePull || ''}
                  onChange={(e) => updateForm({ quotePull: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Who should attend this workshop?</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF5136] focus:border-[#FF5136] outline-none transition"
                placeholder="e.g. Aspiring AI product managers, technical founders..."
                value={formData.whoShouldAttend || ''}
                onChange={(e) => updateForm({ whoShouldAttend: e.target.value })}
              />
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Final Settings & Consent</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Tone</label>
                    <select 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#FF5136] transition"
                        value={formData.tone}
                        onChange={(e) => updateForm({ tone: e.target.value as Tone })}
                    >
                        <option value={Tone.PROFESSIONAL}>Professional</option>
                        <option value={Tone.CASUAL}>Casual</option>
                        <option value={Tone.BOLD}>Bold</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Length</label>
                    <select 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#FF5136] transition"
                        value={formData.length}
                        onChange={(e) => updateForm({ length: e.target.value as Length })}
                    >
                        <option value={Length.SHORT}>Short</option>
                        <option value={Length.MEDIUM}>Medium</option>
                        <option value={Length.LONG}>Long</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">CTA Style</label>
                    <select 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#FF5136] transition"
                        value={formData.ctaStyle}
                        onChange={(e) => updateForm({ ctaStyle: e.target.value as CTAStyle })}
                    >
                        <option value={CTAStyle.SOFT}>Soft Mention</option>
                        <option value={CTAStyle.DIRECT}>Direct Ask</option>
                        <option value={CTAStyle.NONE}>None</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex items-start space-x-3">
                    <input 
                        type="checkbox" 
                        className="mt-1 h-4 w-4 text-[#FF5136] border-slate-300 rounded focus:ring-[#FF5136]" 
                        checked={formData.anonymize}
                        onChange={(e) => updateForm({ anonymize: e.target.checked })}
                    />
                    <label className="text-sm text-slate-600">
                        <strong>Redaction Mode:</strong> Anonymize my name and company in the final drafts.
                    </label>
                </div>
                <div className="flex items-start space-x-3">
                    <input 
                        type="checkbox" 
                        className="mt-1 h-4 w-4 text-[#FF5136] border-slate-300 rounded focus:ring-[#FF5136]" 
                        checked={formData.consentToUse}
                        onChange={(e) => updateForm({ consentToUse: e.target.checked })}
                    />
                    <label className="text-sm text-slate-600">
                        I give permission for Mimosa Workshops to use these generated testimonials for marketing purposes.
                    </label>
                </div>
            </div>

            <button 
                onClick={handleGenerate}
                className="w-full py-4 bg-[#FF5136] hover:bg-[#E64930] text-white rounded-xl font-bold text-xl shadow-lg shadow-[#FF5136]/20 transition-all flex items-center justify-center space-x-2"
            >
                <i className="fa-solid fa-sparkles"></i>
                <span>Generate Testimonials</span>
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-12 flex justify-between">
          <button 
            onClick={step === 1 ? onCancel : prevStep}
            className="px-6 py-3 text-slate-600 hover:text-slate-900 font-semibold transition"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          {step < 6 && (
            <button 
              onClick={nextStep}
              className="px-8 py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-semibold shadow-lg transition transform hover:-translate-y-1"
            >
              Next Step
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wizard;
