import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Award, Search, Download, QrCode, ShieldCheck, ExternalLink } from 'lucide-react';
import { CertificateItem } from '../../types';

export const CertificateVault: React.FC = () => {
  const { certificates } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  const categories = ['All', 'Participation', 'Winner', 'Runner-Up', 'Volunteer', 'Organizer', 'Workshop'];

  const filteredCerts = certificates.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.certificate_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-outfit flex items-center space-x-2">
          <Award className="w-6 h-6 text-emerald-400" />
          <span>EDGEZEN Personal Certificate Vault</span>
        </h1>
        <p className="text-xs text-slate-400">View, download, and verify your official club achievements with cryptographically hashed QR codes.</p>
      </div>

      {/* Search & Filter */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search certificate by ID (e.g. CERT-EDGEZEN-2026-091) or event name..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1 rounded-full border whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold shadow-glow'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Certificate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCerts.map(cert => (
          <div
            key={cert.id}
            className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-emerald-500/40 space-y-4 transition-all"
          >
            <div className="relative group overflow-hidden rounded-xl border border-slate-800">
              <img
                src={cert.file_url}
                alt={cert.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white p-2.5 rounded-xl shadow-glow"
                  title="Verify Certificate QR Code"
                >
                  <QrCode className="w-5 h-5" />
                </button>
                <a
                  href={cert.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-xl shadow-glow"
                  title="Download High-Res Certificate"
                >
                  <Download className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded uppercase font-bold">
                  {cert.category}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{cert.issue_date}</span>
              </div>

              <h3 className="font-extrabold text-base text-white leading-snug">{cert.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{cert.event_name}</p>

              <div className="mt-3 p-2.5 bg-slate-900/90 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">ID: {cert.certificate_number}</span>
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="text-cyan-400 hover:underline flex items-center space-x-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verify</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* QR Code Verification Modal */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl p-6 max-w-sm w-full border border-emerald-500/40 text-center space-y-4 shadow-glass animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-extrabold text-lg text-white">Certificate Verification</h3>
              <p className="text-xs text-slate-400 mt-0.5">Authenticity verified by EDGEZEN Cryptographic Engine</p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl inline-block border-2 border-emerald-500">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(selectedCert.qr_hash)}`}
                alt="Verification QR"
                className="w-40 h-40 mx-auto"
              />
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs font-mono text-left space-y-1.5">
              <div className="flex justify-between"><span className="text-slate-400">Recipient:</span><span className="text-slate-200 font-bold">{selectedCert.student_name}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Reg No:</span><span className="text-slate-200">{selectedCert.register_number}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Cert ID:</span><span className="text-cyan-400">{selectedCert.certificate_number}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Status:</span><span className="text-emerald-400 font-bold">100% Authentic</span></div>
            </div>

            <button
              onClick={() => setSelectedCert(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl text-xs font-bold"
            >
              Close Verification Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
