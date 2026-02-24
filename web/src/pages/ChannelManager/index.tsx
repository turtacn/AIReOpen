import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchChannels, type Channel } from '../../services/api';
import clsx from 'clsx';

export default function ChannelManager() {
  const { t } = useTranslation();
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    fetchChannels().then(setChannels);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('nav.channels')}</h1>

      <div className="bg-white rounded-xl shadow border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-sm font-medium text-slate-500">{t('channelManager.name')}</th>
              <th className="px-6 py-4 text-sm font-medium text-slate-500">{t('channelManager.provider')}</th>
              <th className="px-6 py-4 text-sm font-medium text-slate-500">{t('channelManager.status')}</th>
              <th className="px-6 py-4 text-sm font-medium text-slate-500">{t('channelManager.weight')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {channels.map((channel) => (
              <tr key={channel.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium">{channel.name}</td>
                <td className="px-6 py-4 text-slate-500">{channel.provider}</td>
                <td className="px-6 py-4">
                  <span className={clsx(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    channel.status === 'active' && "bg-green-100 text-green-700",
                    channel.status === 'dead' && "bg-red-100 text-red-700",
                    channel.status === 'testing' && "bg-yellow-100 text-yellow-700"
                  )}>
                    {channel.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{channel.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
