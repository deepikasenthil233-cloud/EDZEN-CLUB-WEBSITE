import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { BookOpen, Search, Download, Bookmark, ExternalLink, FileText, Code, Video, Sparkles } from 'lucide-react';
import { ResourceCategory, FileType } from '../../types';

export const ResourceLibrary: React.FC = () => {
  const { resources, bookmarkedResourceIds, toggleBookmarkResource, incrementDownloadCount } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFileType, setSelectedFileType] = useState<string>('All');

  const categories: string[] = [
    'All',
    'Artificial Intelligence',
    'Machine Learning',
    'Deep Learning',
    'Data Science',
    'Python Programming',
    'Cyber Security',
    'Web Development',
    'Cloud Computing',
    'Prompt Engineering',
    'Research Papers',
    'Placement Materials'
  ];

  const fileTypes: string[] = ['All', 'PDF', 'PPT', 'DOCX', 'ZIP', 'Video', 'GitHub', 'Source Code'];

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesFileType = selectedFileType === 'All' || r.file_type === selectedFileType;
    return matchesSearch && matchesCategory && matchesFileType;
  });

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case 'PDF':
      case 'DOCX':
      case 'PPT':
        return <FileText className="w-5 h-5 text-cyan-400" />;
      case 'Source Code':
      case 'GitHub':
        return <Code className="w-5 h-5 text-emerald-400" />;
      case 'Video':
        return <Video className="w-5 h-5 text-rose-400" />;
      default:
        return <BookOpen className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-outfit flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-cyan-400" />
          <span>EDGEZEN Central Resource Library</span>
        </h1>
        <p className="text-xs text-slate-400">Access curated learning materials, research papers, source code, and workshop archives.</p>
      </div>

      {/* Search & Filter Controls */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search resources by keyword, title, topic..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={selectedFileType}
            onChange={e => setSelectedFileType(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            {fileTypes.map(t => (
              <option key={t} value={t}>{t === 'All' ? 'All File Formats' : t}</option>
            ))}
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`text-xs px-3 py-1 rounded-full border whitespace-nowrap transition-all ${
                selectedCategory === c
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold shadow-glow'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map(r => {
          const isBookmarked = bookmarkedResourceIds.includes(r.id);
          return (
            <div
              key={r.id}
              className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-cyan-500/40 flex flex-col justify-between space-y-4 group transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      {getFileIcon(r.file_type)}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded uppercase">
                        {r.file_type}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono ml-2">{r.file_size || '1.5 MB'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleBookmarkResource(r.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isBookmarked
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                    title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Resource'}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors leading-snug">
                  {r.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {r.description}
                </p>

                <div className="mt-3 text-[11px] text-slate-500 font-mono flex items-center justify-between">
                  <span>Category: {r.category}</span>
                  <span>By: {r.uploaded_by}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono flex items-center space-x-1">
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{r.download_count} downloads</span>
                </span>

                <a
                  href={r.file_url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => incrementDownloadCount(r.id)}
                  className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-glow transition-all"
                >
                  <span>Access Asset</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
