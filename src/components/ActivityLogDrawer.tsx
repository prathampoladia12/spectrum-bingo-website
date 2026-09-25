import React from 'react';
import type { LogEntry } from '../types/game';
import { X, History, CheckCircle2, XCircle, KeyRound, Swords, Trophy, FastForward } from 'lucide-react';

interface ActivityLogDrawerProps {
  isOpen: boolean;
  history: LogEntry[];
  onClose: () => void;
}

export const ActivityLogDrawer: React.FC<ActivityLogDrawerProps> = ({
  isOpen,
  history,
  onClose,
}) => {
  if (!isOpen) return null;

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'correct':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'wrong':
        return <XCircle className="w-4 h-4 text-rose-400" />;
      case 'unlock':
        return <KeyRound className="w-4 h-4 text-amber-400" />;
      case 'tie':
        return <Swords className="w-4 h-4 text-purple-400" />;
      case 'win':
        return <Trophy className="w-4 h-4 text-yellow-400" />;
      case 'pass':
        return <FastForward className="w-4 h-4 text-zinc-400" />;
      default:
        return <History className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md h-full bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <History className="w-4 h-4 text-zinc-400" />
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Game Activity Log
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
              {history.length} events
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {history.length === 0 ? (
            <div className="text-center py-12 text-zinc-400 text-sm">
              No game activity recorded yet.
            </div>
          ) : (
            history.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-950/50 flex items-start gap-3 hover:border-zinc-700/80 transition-all text-xs"
              >
                <span className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0 mt-0.5">
                  {getLogIcon(log.type)}
                </span>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-400">{log.timestamp}</span>
                    {log.pointsDelta !== undefined && log.pointsDelta > 0 && (
                      <span className="font-mono text-emerald-400 font-bold">+{log.pointsDelta} PTS</span>
                    )}
                    {log.creditsDelta !== undefined && (
                      <span className="font-mono text-amber-400 font-medium">{log.creditsDelta} CR</span>
                    )}
                  </div>
                  <p className="text-zinc-200 leading-snug">{log.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
