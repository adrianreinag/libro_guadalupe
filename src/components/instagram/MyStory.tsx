import type { Component } from 'solid-js';

interface MyStoryProps {
  imagen: string;
  onClick?: () => void;
}

const MyStory: Component<MyStoryProps> = (props) => {
  return (
    <button
      class="flex flex-col items-center gap-1 min-w-[95px] cursor-pointer"
      onClick={props.onClick}
    >
      <div class="relative flex-shrink-0">
        {/* Anillo invisible para mantener el mismo tamaño que Story */}
        <div class="p-[3px] rounded-full border-transparent">
          <div class="bg-transparent p-[3px] rounded-full">
            <div class="!w-[82px] !h-[82px] rounded-full overflow-hidden">
              <img
                src={props.imagen}
                alt="Tu historia"
                class="!w-[82px] !h-[82px] object-cover flex-shrink-0"
              />
            </div>
          </div>
        </div>
        <div class="absolute bottom-0 right-0 w-7 h-7 bg-black rounded-full border-[2.5px] border-white flex items-center justify-center">
          <svg
            class="w-3.5 h-3.5 text-white"
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
      <span class="text-xs text-gray-800 text-center truncate w-full px-1">
        Tu historia
      </span>
    </button>
  );
};

export default MyStory;
