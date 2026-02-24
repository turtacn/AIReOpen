import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchKnowledgeDocs, type KnowledgeDoc } from '../../services/api';
import clsx from 'clsx';
import { FileText, Loader2, Check, X } from 'lucide-react';

export default function KnowledgeBase() {
  const { t } = useTranslation();
  const [docs, setDocs] = useState<KnowledgeDoc[]>([]);

  useEffect(() => {
    fetchKnowledgeDocs().then(setDocs);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('nav.knowledge')}</h1>

      <div className="bg-white rounded-xl shadow border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-sm font-medium text-slate-500">{t('knowledgeBase.filename')}</th>
              <th className="px-6 py-4 text-sm font-medium text-slate-500">{t('knowledgeBase.status')}</th>
              <th className="px-6 py-4 text-sm font-medium text-slate-500">{t('knowledgeBase.vectors')}</th>
              <th className="px-6 py-4 text-sm font-medium text-slate-500">{t('knowledgeBase.id')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {docs.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium flex items-center gap-3">
                  <FileText className="text-blue-500" size={18} />
                  {doc.filename}
                </td>
                <td className="px-6 py-4">
                  <span className={clsx(
                    "flex items-center gap-1.5 text-sm",
                    doc.status === 'ready' && "text-green-600",
                    doc.status === 'embedding' && "text-blue-600",
                    doc.status === 'failed' && "text-red-600"
                  )}>
                    {doc.status === 'ready' && <Check size={16} />}
                    {doc.status === 'embedding' && <Loader2 size={16} className="animate-spin" />}
                    {doc.status === 'failed' && <X size={16} />}
                    <span className="capitalize">{doc.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{doc.vectors > 0 ? doc.vectors.toLocaleString() : '-'}</td>
                <td className="px-6 py-4 text-slate-400 text-xs font-mono">{doc.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
