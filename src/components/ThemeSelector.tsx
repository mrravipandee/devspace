"use client";

import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const ThemeSelector = () => {
  const { theme, setTheme, darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="grid grid-cols-3 grid-rows-1 gap-0 md:gap-2  w-fit md:flex md:items-center">
      {/* Row 1 */}
      <button
        onClick={() => setTheme('purple')}
        className={`w-4 h-4 md:w-6 md:h-6 rounded-full bg-purple-600 ${theme === 'purple' ? 'ring-2 ring-purple-400 ring-offset-2' : ''}`}
        aria-label="Purple theme"
      />
      <div />
      <button
        onClick={() => setTheme('orange')}
        className={`w-4 h-4 md:w-6 md:h-6 rounded-full bg-orange-600 ${theme === 'orange' ? 'ring-2 ring-orange-400 ring-offset-2' : ''}`}
        aria-label="Orange theme"
      />

      {/* Row 2 */}
      <div />
      <button
        onClick={toggleDarkMode}
        className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-300 ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'
        }`}
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
      </button>
      <div />

      {/* Row 3 */}
      <button
        onClick={() => setTheme('green')}
        className={`w-4 h-4 md:w-6 md:h-6 rounded-full bg-green-600 ${theme === 'green' ? 'ring-2 ring-green-400 ring-offset-2' : ''}`}
        aria-label="Green theme"
      />
      <div />
      <button
        onClick={() => setTheme('blue-purple')}
        className={`w-4 h-4 md:w-6 md:h-6 rounded-full bg-indigo-600 ${theme === 'blue-purple' ? 'ring-2 ring-indigo-400 ring-offset-2' : ''}`}
        aria-label="Blue-purple theme"
      />
    </div>
  );
};

export default ThemeSelector;
