import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { QrCode, CheckCircle2, AlertCircle, Camera, Sparkles } from 'lucide-react';

export const QrScannerView: React.FC = () => {
  const { checkInQrPass } = useData();

  const [inputPass, setInputPass] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleScanPass = (passToTest?: string) => {
    const code = passToTest || inputPass;
    if (!code.trim()) return;

    const res = checkInQrPass(code);
    setScanResult(res);
    if (!passToTest) setInputPass('');
  };

  const samplePasses = [
    'PASS-GENAI-DEEPIKA',
    'PASS-CYBER-2026',
    'PASS-HACK-2026'
  ];

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-outfit flex items-center space-x-2">
          <QrCode className="w-6 h-6 text-purple-400" />
          <span>Automated QR Attendance Scanner</span>
        </h1>
        <p className="text-xs text-slate-400">Scan student event passes at venue doors for instant check-in and automated +10 XP award.</p>
      </div>

      {scanResult && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center space-x-3 ${
          scanResult.success
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
        }`}>
          {scanResult.success ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          <div>
            <div className="font-bold">{scanResult.success ? 'Attendance Verified!' : 'Check-In Issue'}</div>
            <div className="text-slate-300 font-mono mt-0.5">{scanResult.message}</div>
          </div>
        </div>
      )}

      {/* Camera / Manual Scanner Simulation Box */}
      <div className="glass-panel rounded-3xl p-8 border border-purple-500/30 text-center space-y-6 shadow-glass">
        <div className="w-20 h-20 rounded-3xl bg-slate-900 border-2 border-purple-500 text-purple-400 flex items-center justify-center mx-auto shadow-glow relative">
          <Camera className="w-8 h-8" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-purple-400 animate-ping" />
        </div>

        <div>
          <h3 className="font-extrabold text-base text-white">Live Scanner Active</h3>
          <p className="text-xs text-slate-400 mt-1">Point camera at student phone pass or input QR pass hash below</p>
        </div>

        {/* Input Box */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputPass}
              onChange={e => setInputPass(e.target.value)}
              placeholder="e.g. PASS-GENAI-DEEPIKA"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={() => handleScanPass()}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-glow transition-all"
            >
              Verify Pass
            </button>
          </div>

          {/* Preset Test Passes */}
          <div className="pt-2">
            <p className="text-[10px] text-slate-500 font-semibold mb-2 text-left">Quick Demo Passes:</p>
            <div className="flex flex-wrap gap-2">
              {samplePasses.map((pass, idx) => (
                <button
                  key={idx}
                  onClick={() => handleScanPass(pass)}
                  className="text-xs bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 px-3 py-1.5 rounded-xl font-mono transition-colors"
                >
                  ⚡ Scan {pass}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
