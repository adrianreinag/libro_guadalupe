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
  const [dragY, setDragY] = createSignal(0);
  const [isDragging, setIsDragging] = createSignal(false);
  const [isClosing, setIsClosing] = createSignal(false);
  let intervalId: number | undefined;
  let videoRef: HTMLVideoElement | undefined;
  let startY = 0;
  let containerRef: HTMLDivElement | undefined;

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

  // Manejar gestos de swipe down
  const handleTouchStart = (e: TouchEvent) => {
    startY = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging()) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;

    // Solo permitir arrastrar hacia abajo
    if (diff > 0) {
      setDragY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging()) return;

    setIsDragging(false);

    // Si arrastró más de 150px, cerrar
    if (dragY() > 150) {
      handleClose();
    } else {
      // Volver a la posición original
      setDragY(0);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      props.onClose();
      setIsClosing(false);
      setDragY(0);
    }, 250); // Duración de la animación de cierre
  };

  // Limpiar el estado al cerrar
  createEffect(() => {
    if (!props.isOpen) {
      setDragY(0);
      setIsDragging(false);
      setIsClosing(false);
    }
  });

  return (
    <Show when={props.isOpen}>
      <div
        class="fixed inset-0 z-50 bg-black flex items-center justify-center"
        style={{
          animation: isClosing() ? 'fadeOut 0.25s ease-out' : 'fadeIn 0.3s ease-out',
        }}
      >
        {/* Header con barras de progreso */}
        <div class="absolute top-0 left-0 right-0 z-10 p-4">
          {/* Barras de progreso múltiples */}
          <div class="w-full flex gap-1 mb-4">
            {props.historia.map((_, index) => (
              <div class="flex-1 h-[2px] bg-gray-600 bg-opacity-50 rounded-full overflow-hidden">
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
          </div>
        </div>

        {/* Contenido de la historia (imagen o video) */}
        <div
          ref={containerRef}
          class="relative w-full h-full flex items-center justify-center max-w-lg"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: isClosing()
              ? 'translateY(100vh) scale(0.8)'
              : `translateY(${dragY()}px) scale(${Math.max(0.85, 1 - dragY() / 1000)})`,
            opacity: isClosing() ? '0' : `${Math.max(0.5, 1 - dragY() / 500)}`,
            transition: isDragging() ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease-out',
            animation: !isClosing() && dragY() === 0 ? 'zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
          }}
        >
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
