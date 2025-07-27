"use client";

import { useTheme } from '@/context/ThemeContext';

const ThemeSelector = () => {
  const { theme, setTheme, darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="flex items-center space-x-4">
      <div className="flex space-x-2">
        <button
          onClick={() => setTheme('purple')}
          className={`w-6 h-6 rounded-full bg-purple-600 ${theme === 'purple' ? 'ring-2 ring-offset-2 ring-purple-400' : ''}`}
          aria-label="Purple theme"
        />
        <button
          onClick={() => setTheme('orange')}
          className={`w-6 h-6 rounded-full bg-orange-600 ${theme === 'orange' ? 'ring-2 ring-offset-2 ring-orange-400' : ''}`}
          aria-label="Orange theme"
        />
        <button
          onClick={() => setTheme('green')}
          className={`w-6 h-6 rounded-full bg-green-600 ${theme === 'green' ? 'ring-2 ring-offset-2 ring-green-400' : ''}`}
          aria-label="Green theme"
        />
        <button
          onClick={() => setTheme('blue-purple')}
          className={`w-6 h-6 rounded-full bg-indigo-600 ${theme === 'blue-purple' ? 'ring-2 ring-offset-2 ring-indigo-400' : ''}`}
          aria-label="Blue-Purple theme"
        />
      </div>
      <button
        onClick={toggleDarkMode}
        className={`px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}
      >
        {darkMode ? 'Light' : 'Dark'}
      </button>
    </div>
  );
};

export default ThemeSelector;