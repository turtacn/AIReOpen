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
    <aside className="w-72 h-screen fixed left-0 top-0 flex flex-col bg-white/80 dark:bg-slate-900/80 border-r border-slate-200 dark:border-slate-800 backdrop-blur-xl z-20 transition-all">
      <div className="p-6 flex items-center gap-3 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
          A
        </div>
        <span className="font-bold text-lg truncate bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-400">
          {t('app.name')}
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
              )
            }
          >
            <item.icon size={20} className={clsx(
              "transition-transform group-hover:scale-110",
              // dynamic color handled by parent text color
            )} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
            U
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">User Admin</p>
            <p className="text-xs text-slate-500 truncate">admin@aireopen.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
