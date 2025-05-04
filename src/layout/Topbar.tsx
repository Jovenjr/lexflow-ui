import React from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

interface Props {
  toggleDark: () => void;
  dark: boolean;
}

const Topbar: React.FC<Props> = ({ toggleDark, dark }) => (
  <header className="h-14 bg-gray-800 flex items-center justify-between px-4 text-gray-200">
    <div></div>
    <div className="flex items-center gap-4">
      <button className="border border-gray-600 px-3 py-1 rounded-md">USD</button>
      <button onClick={toggleDark} className="p-2 rounded-md hover:bg-gray-700">
        {dark ? <SunIcon className="w-5 h-5"/> : <MoonIcon className="w-5 h-5"/>}
      </button>
      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">U</div>
    </div>
  </header>
);

export default Topbar;
