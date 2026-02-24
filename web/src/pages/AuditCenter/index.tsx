import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchAuditLogs, type AuditLog } from '../../services/api';
import clsx from 'clsx';
import { AlertTriangle, CheckCircle, Ban } from 'lucide-react';

export default function AuditCenter() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    fetchAuditLogs().then((data) => {
      setLogs(data);
      if (data.length > 0) setSelectedLog(data[0]);
    });
  }, []);

  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex flex-col">
      <h1 className="text-2xl font-bold mb-6">{t('nav.audit')}</h1>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* List */}
        <div className="w-1/3 bg-white rounded-xl shadow border border-slate-100 flex flex-col">
          <div className="p-4 border-b border-slate-100 font-medium text-slate-500">
            {t('auditCenter.recentEvents')}
          </div>
          <div className="flex-1 overflow-auto p-2 space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className={clsx(
                  "p-3 rounded-lg cursor-pointer border transition-colors",
                  selectedLog?.id === log.id
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-transparent hover:bg-slate-50"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  <span className={clsx(
                    "text-xs font-bold px-1.5 py-0.5 rounded",
                    log.riskLevel === 'high' && "bg-red-100 text-red-700",
                    log.riskLevel === 'medium' && "bg-orange-100 text-orange-700",
                    log.riskLevel === 'low' && "bg-green-100 text-green-700"
                  )}>
                    {log.riskLevel.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm font-medium truncate">{log.user}</div>
                <div className="text-xs text-slate-400 truncate">{log.actionTaken}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail / Diff View */}
        <div className="flex-1 bg-white rounded-xl shadow border border-slate-100 flex flex-col">
          {selectedLog ? (
            <>
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-xl">
                <div>
                  <h2 className="font-bold text-lg">{t('auditCenter.eventDetail')}: {selectedLog.id}</h2>
                  <p className="text-sm text-slate-500">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                   {selectedLog.actionTaken === 'blocked' && <Ban className="text-red-500" />}
                   {selectedLog.actionTaken === 'masked' && <AlertTriangle className="text-orange-500" />}
                   {selectedLog.actionTaken === 'allowed' && <CheckCircle className="text-green-500" />}
                   <span className="font-medium capitalize">{selectedLog.actionTaken}</span>
                </div>
              </div>

              <div className="flex-1 p-6 space-y-6 overflow-auto">
                <div>
                  <h3 className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">{t('auditCenter.originalPrompt')}</h3>
                  <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-900 font-mono text-sm whitespace-pre-wrap">
                    {selectedLog.originalPrompt}
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="bg-slate-100 p-2 rounded-full">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">{t('auditCenter.maskedPrompt')}</h3>
                  <div className="p-4 bg-green-50 border border-green-100 rounded-lg text-green-900 font-mono text-sm whitespace-pre-wrap">
                    {selectedLog.maskedPrompt}
                  </div>
                </div>
              </div>
            </>
          ) : (
             <div className="flex-1 flex items-center justify-center text-slate-400">
               {t('auditCenter.selectEvent')}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
