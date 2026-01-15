
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { TestimonialEntry } from '../types';

interface AdminProps {
  onView: (id: string) => void;
}

const Admin: React.FC<AdminProps> = ({ onView }) => {
  const [entries, setEntries] = useState<TestimonialEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setEntries(storageService.getAllEntries().sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this submission?")) {
        storageService.deleteEntry(id);
        setEntries(entries.filter(e => e.id !== id));
    }
  };

  const filteredEntries = entries.filter(e => 
    e.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.roleTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Submissions Dashboard</h1>
          <p className="text-slate-500">Manage workshop testimonials and exports.</p>
        </div>
        <div className="relative w-full md:w-80">
            <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
                type="text" 
                placeholder="Search by name or role..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF5136] outline-none transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Participant</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Role & Company</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Consent</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {filteredEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-[#FFF5F3] text-[#FF5136] flex items-center justify-center font-bold">
                                    {entry.participantName.charAt(0)}
                                </div>
                                <div className="font-semibold text-slate-900">{entry.participantName}</div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-sm text-slate-700">{entry.roleTitle}</div>
                            <div className="text-xs text-slate-400">{entry.company || 'Private'}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                            {new Date(entry.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex space-x-2">
                                {entry.consentToUse ? (
                                    <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded uppercase">Marketable</span>
                                ) : (
                                    <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase">Private</span>
                                )}
                                {entry.anonymize && (
                                    <span className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded uppercase">Anonymized</span>
                                )}
                            </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex justify-end space-x-2">
                                <button 
                                    onClick={() => onView(entry.id)}
                                    className="p-2 text-[#FF5136] hover:bg-[#FFF5F3] rounded-lg transition"
                                    title="View Results"
                                >
                                    <i className="fa-solid fa-eye"></i>
                                </button>
                                <button 
                                    onClick={() => handleDelete(entry.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                    title="Delete Submission"
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {filteredEntries.length === 0 && (
            <div className="p-20 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 text-2xl mx-auto mb-4">
                    <i className="fa-solid fa-inbox"></i>
                </div>
                <h3 className="text-lg font-bold text-slate-900">No entries yet</h3>
                <p className="text-slate-500">Share your builder link with participants to get started.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
