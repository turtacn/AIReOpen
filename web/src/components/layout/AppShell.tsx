import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { LanguageToggle } from './LanguageToggle';

export function AppShell() {
  return (
    <div className="flex min-h-screen bg-transparent relative overflow-hidden">
      {/* Background Gradient Layer for Gemini feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30 dark:from-slate-900 dark:to-slate-950 -z-10 pointer-events-none" />

      <Sidebar />
      <main className="flex-1 ml-72 flex flex-col min-h-screen transition-all">
        <header className="h-16 px-6 py-4 flex items-center justify-end sticky top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-800/50">
           <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
                Docs
              </div>
              <div className="hidden md:flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
                Help
              </div>
              <LanguageToggle />
           </div>
        </header>
        <div className="flex-1 p-6 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
