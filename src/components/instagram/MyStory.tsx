import type { Component } from 'solid-js';
import confetti from 'canvas-confetti';

interface MyStoryProps {
  imagen: string;
  onClick?: () => void;
}

const MyStory: Component<MyStoryProps> = (props) => {
  const handleClick = (e: MouseEvent) => {
    // Obtener la posición del click para el confeti
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    // Efecto de confeti sutil
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x, y },
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
      ticks: 150,
      gravity: 0.8,
      scalar: 0.8,
      drift: 0,
    });

    // Confeti adicional más pequeño y disperso
    setTimeout(() => {
      confetti({
        particleCount: 30,
        spread: 80,
        origin: { x, y },
        colors: ['#FFD93D', '#6BCF7F', '#A8DADC'],
        ticks: 120,
        gravity: 0.6,
        scalar: 0.6,
      });
    }, 100);
  };

  return (
    <button
      class="flex flex-col items-center gap-1 min-w-[95px] cursor-pointer"
      onClick={handleClick}
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
