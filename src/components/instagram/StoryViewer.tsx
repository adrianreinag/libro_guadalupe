import { type Component, createSignal, createEffect, Show, onCleanup } from 'solid-js';
import type { HistoriaItem } from './Story';
import { markStoryAsViewed } from '../../utils/instagram/storiesStorage';

interface StoryViewerProps {
  imagenPerfil: string;
  nombreUsuario: string;
  historia: HistoriaItem[];
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const StoryViewer: Component<StoryViewerProps> = (props) => {
  const [currentHistoriaIndex, setCurrentHistoriaIndex] = createSignal(0);
  const [progress, setProgress] = createSignal(0);
  let intervalId: number | undefined;
  let videoRef: HTMLVideoElement | undefined;

  const currentHistoria = () => props.historia[currentHistoriaIndex()];
  const isVideo = () => currentHistoria()?.tipo === 'video';

  // Marcar la historia actual como vista cuando se carga
  createEffect(() => {
    if (props.isOpen) {
      const historia = currentHistoria();
      if (historia?.id) {
        markStoryAsViewed(historia.id);
      }
    }
  });

  const nextHistoria = () => {
    if (currentHistoriaIndex() < props.historia.length - 1) {
      setCurrentHistoriaIndex(currentHistoriaIndex() + 1);
      setProgress(0);
    } else {
      // Terminaron todas las historias de este usuario, ir al siguiente
      if (props.onNext) {
        props.onNext();
      } else {
        props.onClose();
      }
      setCurrentHistoriaIndex(0);
    }
  };

  const previousHistoria = () => {
    if (currentHistoriaIndex() > 0) {
      setCurrentHistoriaIndex(currentHistoriaIndex() - 1);
      setProgress(0);
    } else if (props.onPrevious) {
      props.onPrevious();
      setCurrentHistoriaIndex(0);
    }
  };

  createEffect(() => {
    if (props.isOpen && !isVideo()) {
      setProgress(0);
      // Auto-progress para imágenes (5 segundos)
      intervalId = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            nextHistoria();
            return 0;
          }
          return prev + 1;
        });
      }, 50); // 5 segundos total (100 * 50ms)
    } else {
      if (intervalId) {
        clearInterval(intervalId);
      }
    }
  });

  // Manejar videos
  createEffect(() => {
    if (props.isOpen && isVideo() && videoRef) {
      videoRef.play();

      const updateProgress = () => {
        if (videoRef) {
          const percent = (videoRef.currentTime / videoRef.duration) * 100;
          setProgress(percent);
        }
      };

      const handleEnded = () => {
        nextHistoria();
      };

      videoRef.addEventListener('timeupdate', updateProgress);
      videoRef.addEventListener('ended', handleEnded);

      onCleanup(() => {
        if (videoRef) {
          videoRef.removeEventListener('timeupdate', updateProgress);
          videoRef.removeEventListener('ended', handleEnded);
        }
      });
    }
  });

  createEffect(() => {
    if (!props.isOpen) {
      setCurrentHistoriaIndex(0);
      setProgress(0);
    }
  });

  onCleanup(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  const handleLeftClick = () => {
    previousHistoria();
  };

  const handleRightClick = () => {
    nextHistoria();
  };

  return (
    <Show when={props.isOpen}>
      <div class="fixed inset-0 z-50 bg-black flex items-center justify-center">
        {/* Header con barras de progreso */}
        <div class="absolute top-0 left-0 right-0 z-10 p-4">
          {/* Barras de progreso múltiples */}
          <div class="w-full flex gap-1 mb-4">
            {props.historia.map((_, index) => (
              <div class="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                <div
                  class="h-full bg-white transition-all duration-100"
                  style={{
                    width: index === currentHistoriaIndex()
                      ? `${progress()}%`
                      : index < currentHistoriaIndex()
                        ? '100%'
                        : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Usuario info */}
          <div class="flex items-center gap-3">
            <img
              src={props.imagenPerfil}
              alt={props.nombreUsuario}
              class="w-8 h-8 rounded-full object-cover border-2 border-white"
            />
            <span class="text-white font-semibold text-sm">{props.nombreUsuario}</span>
            <button
              onClick={props.onClose}
              class="ml-auto text-white"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenido de la historia (imagen o video) */}
        <div class="relative w-full h-full flex items-center justify-center max-w-lg">
          {isVideo() ? (
            <video
              ref={videoRef}
              src={currentHistoria()?.url}
              class="max-h-full max-w-full object-contain"
              autoplay
              muted
              playsinline
            />
          ) : (
            <img
              src={currentHistoria()?.url}
              alt="Story"
              class="max-h-full max-w-full object-contain"
            />
          )}

          {/* Áreas clicables para navegación */}
          <div class="absolute inset-0 flex">
            <button
              class="flex-1 cursor-pointer"
              onClick={handleLeftClick}
              aria-label="Previous story"
            />
            <button
              class="flex-1 cursor-pointer"
              onClick={handleRightClick}
              aria-label="Next story"
            />
          </div>
        </div>
      </div>
    </Show>
  );
};

export default StoryViewer;
