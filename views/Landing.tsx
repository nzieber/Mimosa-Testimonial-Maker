
import React from 'react';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FFF5F3] text-[#FF5136] text-sm font-medium mb-6">
        <span>AI-native builder community</span>
        <i className="fa-solid fa-sparkles"></i>
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
        Turn your workshop outputs into <span className="text-[#FF5136]">polished testimonials.</span>
      </h1>
      <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
        Don't let your hard work go unnoticed. We work with the world's most creative people starting and scaling new ideas using AI.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-20">
        <button 
          onClick={onStart}
          className="w-full sm:w-auto px-10 py-5 bg-[#FF5136] hover:bg-[#E64930] text-white rounded-xl font-bold text-lg shadow-xl shadow-[#FF5136]/20 transition-all transform hover:-translate-y-1"
        >
          Start Your Testimonial
        </button>
        <button className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold text-lg transition-all">
          View Examples
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
        <FeatureCard icon="fa-newspaper" title="Blog Post" description="Detailed narrative about your build process and learnings." />
        <FeatureCard icon="fa-brands fa-linkedin" title="LinkedIn" description="Professional summary optimized for reach and authority." />
        <FeatureCard icon="fa-brands fa-x-twitter" title="X Thread" description="Bite-sized updates and insights for your social followers." />
        <FeatureCard icon="fa-envelope" title="Referral Email" description="Perfect for sharing your success with bosses or peers." />
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: string, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition">
    <div className="w-12 h-12 bg-[#FFF5F3] rounded-xl flex items-center justify-center text-[#FF5136] text-xl mb-4">
      <i className={icon}></i>
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
  </div>
);

export default Landing;
