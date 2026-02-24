import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageSquare, LayoutDashboard, Radio, ShieldAlert, Book } from 'lucide-react';
import clsx from 'clsx';

export function Sidebar() {
  const { t } = useTranslation();

  const navItems = [
    { to: '/', icon: MessageSquare, label: t('nav.chat') },
    { to: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/channels', icon: Radio, label: t('nav.channels') },
    { to: '/audit', icon: ShieldAlert, label: t('nav.audit') },
    { to: '/knowledge', icon: Book, label: t('nav.knowledge') },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0">
      <div className="p-4 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">A</div>
        <span className="font-bold text-lg truncate">{t('app.name')}</span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
