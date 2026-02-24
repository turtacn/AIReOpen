import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { LanguageToggle } from './LanguageToggle';

export function AppShell() {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-end px-6 shadow-sm sticky top-0 z-10">
          <LanguageToggle />
        </header>
        <div className="flex-1 p-6 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
