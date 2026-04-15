import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderOpen,
  Package,
  Tags,
  Bell,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import svgPaths from '../../imports/仪表盘Dashboard/svg-raqljneyvr';
import imgUserProfile from '../../imports/仪表盘Dashboard/2503296d0ef148993812106d7a453c4e10597a1d.png';

const topNavigation = [
  { name: 'Dashboard / 工作台', href: '/' },
  { name: 'Materials / 资料', href: '/source-materials' },
  { name: 'Products / 成品', href: '/products' },
];

const sideNavigation = [
  { name: 'DASHBOARD / 工作台', href: '/', icon: LayoutDashboard },
  { name: 'RAW MATERIALS / 原始资料', href: '/source-materials', icon: FolderOpen },
  { name: 'PROCESSING / 处理工作台', href: '/process-workbench', icon: Package },
  { name: 'PRODUCTS / 成品库', href: '/products', icon: GraduationCap },
  { name: 'METADATA / 元数据', href: '/metadata', icon: Tags },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-white/60 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="h-full px-8 flex items-center justify-between">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="font-bold text-xl text-blue-700">
              教育资料处理平台 / EduDoc Platform
            </Link>
            <nav className="flex items-center gap-6">
              {topNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`pb-1 text-sm font-medium transition-colors relative ${
                      isActive
                        ? 'text-blue-700 border-b-2 border-blue-700'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Create Content + Icons + Profile */}
          <div className="flex items-center gap-4">
            <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-shadow">
              Create Content
            </button>
            <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
              <Bell className="w-5 h-5" />
            </button>
            <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <img src={imgUserProfile} alt="Profile" className="w-10 h-10 rounded-full border-2 border-blue-200" />
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 overflow-y-auto">
          {/* Logo Section */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-extrabold text-blue-700 text-xs leading-tight">
                  <div>EduDoc</div>
                  <div>Platform</div>
                </div>
              </div>
            </div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              文档处理平台 / DOC PROCESSING
            </p>
          </div>

          {/* Navigation */}
          <nav className="px-3 pb-4">
            {sideNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-3 mb-1 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs font-semibold tracking-wide">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-white">
            <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-shadow">
              UPGRADE PLAN
            </button>
            <div className="mt-4 space-y-2">
              <Link to="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs font-semibold">SETTINGS</span>
              </Link>
              <Link to="/support" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-xs font-semibold">SUPPORT</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
