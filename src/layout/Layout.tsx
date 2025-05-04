import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [dark, setDark] = React.useState<boolean>(() => document.documentElement.classList.contains('dark'));
  const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
    setDark(!dark);
  };

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-gray-100 dark:bg-gray-900">
        <Topbar toggleDark={toggleDark} dark={dark} />
        <main className="flex-1 overflow-y-auto p-6 text-gray-900 dark:text-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
