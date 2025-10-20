import type { Component } from 'solid-js';

export interface HistoriaItem {
  id: string; // ID único para rastrear si fue vista
  tipo: 'imagen' | 'video';
  url: string;
  duration?: number; // Duración en segundos (opcional para retrocompatibilidad)
}

interface StoryProps {
  imagenPerfil: string;
  nombreUsuario: string;
  historia: HistoriaItem[];
  visto?: boolean;
  mejorAmigo?: boolean;
  onClick?: () => void;
}

const Story: Component<StoryProps> = (props) => {
  const gradientStyle = () => {
    if (props.visto) {
      return 'bg-gray-300';
    }
    return '';
  };

  const gradientInlineStyle = () => {
    if (props.visto) {
      return {};
    }
    if (props.mejorAmigo) {
      return {
        background: '#1CD14F'
      };
    }
    return {
      background: 'linear-gradient(45deg, #FFC504, #FF1A53, #D300C5)'
    };
  };

  return (
    <button
      class="flex flex-col items-center gap-1 min-w-[90px] cursor-pointer"
      onClick={props.onClick}
    >
      <div class={`p-[3px] rounded-full overflow-hidden ${gradientStyle()}`} style={gradientInlineStyle()}>
        <div class="bg-white p-[3px] rounded-full overflow-hidden">
          <div class="!w-[82px] !h-[82px] rounded-full overflow-hidden">
            <img
              src={props.imagenPerfil}
              alt={props.nombreUsuario}
              class="!w-[82px] !h-[82px] object-cover flex-shrink-0"
            />
          </div>
        </div>
      </div>
      <span class="text-xs text-gray-800 text-center truncate w-full px-1">
        {props.nombreUsuario}
      </span>
    </button>
  );
};

export default Story;
