import type { Component } from 'solid-js';

const ButtonNavigationBar: Component = () => {
  return (
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div class="max-w-2xl mx-auto flex items-center justify-around py-2 px-4">
        {/* Home */}
        <button class="p-2 hover:opacity-70 transition-opacity">
          <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.005 16.545a2.997 2.997 0 012.997-2.997h0A2.997 2.997 0 0115 16.545V22h7V11.543L12 2 2 11.543V22h7.005z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" />
          </svg>
        </button>

        {/* Search */}
        <button class="p-2 hover:opacity-70 transition-opacity">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* Add/Create */}
        <button class="p-2 hover:opacity-70 transition-opacity">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2" />
            <line x1="12" y1="8" x2="12" y2="16" stroke-width="2" />
            <line x1="8" y1="12" x2="16" y2="12" stroke-width="2" />
          </svg>
        </button>

        {/* Reels/Video */}
        <button class="p-2 hover:opacity-70 transition-opacity">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Profile */}
        <button class="p-2 hover:opacity-70 transition-opacity">
          <div class="w-7 h-7 rounded-full border-2 border-gray-800 overflow-hidden">
            <svg class="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ButtonNavigationBar;
