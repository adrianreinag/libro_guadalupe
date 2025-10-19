import type { Component } from 'solid-js';

interface MyStoryProps {
  imagen: string;
  onClick?: () => void;
}

const MyStory: Component<MyStoryProps> = (props) => {
  return (
    <button
      class="flex flex-col items-center gap-1 min-w-[110px] cursor-pointer"
      onClick={props.onClick}
    >
      <div class="relative flex-shrink-0">
        {/* Anillo invisible para mantener el mismo tamaño que Story */}
        <div class="p-1 rounded-full border-transparent">
          <div class="bg-transparent p-1 rounded-full">
            <div class="!w-24 !h-24 rounded-full overflow-hidden">
              <img
                src={props.imagen}
                alt="Tu historia"
                class="!w-24 !h-24 object-cover flex-shrink-0"
              />
            </div>
          </div>
        </div>
        <div class="absolute bottom-1 right-1 w-8 h-8 bg-black rounded-full border-[3px] border-white flex items-center justify-center">
          <svg
            class="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
      </div>
      <span class="text-sm text-gray-800 text-center truncate w-full px-1">
        Tu historia
      </span>
    </button>
  );
};

export default MyStory;
