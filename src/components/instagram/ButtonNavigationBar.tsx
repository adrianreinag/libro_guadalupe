import type { Component } from 'solid-js';

const ButtonNavigationBar: Component = () => {
  return (
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div class="max-w-2xl mx-auto flex items-center justify-around py-2 px-4">
        {/* Home */}
        <button class="p-2 hover:opacity-70 transition-opacity">
          <img src="/assets/instagram/icons/home.svg" alt="Home" class="w-7 h-7" />
        </button>

        {/* Explore */}
        <button class="p-2 hover:opacity-70 transition-opacity">
          <img src="/assets/instagram/icons/explore.svg" alt="Explore" class="w-7 h-7" />
        </button>

        {/* Post */}
        <button class="p-2 hover:opacity-70 transition-opacity">
          <img src="/assets/instagram/icons/post.svg" alt="Post" class="w-7 h-7" />
        </button>

        {/* Reel */}
        <button class="p-2 hover:opacity-70 transition-opacity">
          <img src="/assets/instagram/icons/reel.svg" alt="Reel" class="w-7 h-7" />
        </button>

        {/* Profile */}
        <button class="p-2 hover:opacity-70 transition-opacity">
          <div class="w-7 h-7 rounded-full border-2 border-gray-800 overflow-hidden">
            <img
              src="/assets/instagram/stories/Me_Avatar.jpg"
              alt="Profile"
              class="w-full h-full object-cover"
            />
          </div>
        </button>
      </div>
    </div>
  );
};

export default ButtonNavigationBar;
