import React from 'react';
import { Sparkles, FileDown, Loader2, Wand2 } from 'lucide-react';
import { EditorStatus } from '../types';

interface ToolbarProps {
  onRepair: () => void;
  onExport: () => void;
  status: EditorStatus;
  statusMessage?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onRepair, onExport, status, statusMessage }) => {
  const isProcessing = status === EditorStatus.PROCESSING;

  return (
    <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shadow-sm z-10">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">DocuFlow AI</h1>
        <span className="text-xs font-medium px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 hidden sm:inline-block">Pandoc-style Conversion</span>
      </div>

      <div className="flex items-center gap-4">
        {statusMessage && (
          <span className={`text-sm animate-pulse ${status === EditorStatus.ERROR ? 'text-red-600' : 'text-slate-500'}`}>
            {statusMessage}
          </span>
        )}
        
        <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>

        <button
          onClick={onRepair}
          disabled={isProcessing}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors disabled:opacity-50 shadow-sm"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
          <span>AI Repair</span>
        </button>

        <button
          onClick={onExport}
          disabled={isProcessing}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
          <span>Export Word</span>
        </button>
      </div>
    </div>
  );
};