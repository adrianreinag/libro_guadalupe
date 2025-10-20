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
  const [dragX, setDragX] = createSignal(0);
  const [isClosing, setIsClosing] = createSignal(false);
  const [isPaused, setIsPaused] = createSignal(false);
  const [isTransitioning, setIsTransitioning] = createSignal(false);
  const [transitionDirection, setTransitionDirection] = createSignal<'left' | 'right' | null>(null);

  let intervalId: number | undefined;
  let videoRef: HTMLVideoElement | undefined;
  let startY = 0;
  let startX = 0;
  let longPressTimer: number | undefined;
  let containerRef: HTMLDivElement | undefined;
  let dragStartTime = 0;
  let dragDirection: 'vertical' | 'horizontal' | null = null;

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
    if (isTransitioning()) return;

    if (currentHistoriaIndex() < props.historia.length - 1) {
      setIsTransitioning(true);
      setTransitionDirection('left');
      setTimeout(() => {
        setCurrentHistoriaIndex(currentHistoriaIndex() + 1);
        setProgress(0);
        setTimeout(() => {
          setIsTransitioning(false);
          setTransitionDirection(null);
        }, 400);
      }, 200);
    } else {
      // Terminaron todas las historias de este usuario, ir al siguiente
      if (props.onNext) {
        setIsTransitioning(true);
        setTransitionDirection('left');
        setTimeout(() => {
          props.onNext!();
          setCurrentHistoriaIndex(0);
          setTimeout(() => {
            setIsTransitioning(false);
            setTransitionDirection(null);
          }, 400);
        }, 200);
      } else {
        props.onClose();
      }
    }
  };

  const previousHistoria = () => {
    if (isTransitioning()) return;

    if (currentHistoriaIndex() > 0) {
      setIsTransitioning(true);
      setTransitionDirection('right');
      setTimeout(() => {
        setCurrentHistoriaIndex(currentHistoriaIndex() - 1);
        setProgress(0);
        setTimeout(() => {
          setIsTransitioning(false);
          setTransitionDirection(null);
        }, 400);
      }, 200);
    } else if (props.onPrevious) {
      setIsTransitioning(true);
      setTransitionDirection('right');
      setTimeout(() => {
        props.onPrevious!();
        setCurrentHistoriaIndex(0);
        setTimeout(() => {
          setIsTransitioning(false);
          setTransitionDirection(null);
        }, 400);
      }, 200);
    }
  };

  // Auto-progress para imágenes con duración personalizada
  createEffect(() => {
    if (props.isOpen && !isVideo() && !isPaused() && !isTransitioning()) {
      setProgress(0);

      const historia = currentHistoria();
      const duration = historia?.duration || 5;
      const intervalTime = (duration * 1000) / 100;

      intervalId = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            nextHistoria();
            return 0;
          }
          return prev + 1;
        });
      }, intervalTime);
    } else {
      if (intervalId) {
        clearInterval(intervalId);
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  });

  // Manejar videos
  createEffect(() => {
    if (props.isOpen && isVideo() && videoRef && !isPaused()) {
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
    } else if (videoRef && isPaused()) {
      videoRef.pause();
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
    if (longPressTimer) {
      clearTimeout(longPressTimer);
    }
  });

  // Manejar gestos táctiles (swipe, long press)
  const handleTouchStart = (e: TouchEvent) => {
    startY = e.touches[0].clientY;
    startX = e.touches[0].clientX;
    dragStartTime = Date.now();
    dragDirection = null;

    // Iniciar timer de long press
    longPressTimer = window.setTimeout(() => {
      setIsPaused(true);
    }, 200); // 200ms para considerar long press
  };

  const handleTouchMove = (e: TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const diffY = currentY - startY;
    const diffX = currentX - startX;

    // Determinar dirección del drag solo la primera vez
    if (!dragDirection && (Math.abs(diffX) > 5 || Math.abs(diffY) > 5)) {
      dragDirection = Math.abs(diffX) > Math.abs(diffY) ? 'horizontal' : 'vertical';
    }

    // Cancelar long press si hay movimiento
    if (longPressTimer && (Math.abs(diffX) > 10 || Math.abs(diffY) > 10)) {
      clearTimeout(longPressTimer);
      longPressTimer = undefined;
    }

    // Swipe vertical (cerrar)
    if (dragDirection === 'vertical' && diffY > 0) {
      setDragY(diffY);
    }

    // Swipe horizontal (cambiar historia)
    if (dragDirection === 'horizontal' && !isTransitioning()) {
      setDragX(diffX);
    }
  };

  const handleTouchEnd = () => {
    // Limpiar long press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = undefined;
    }

    // Reanudar si estaba pausado
    setIsPaused(false);

    const swipeDuration = Date.now() - dragStartTime;

    // Swipe vertical - cerrar
    if (dragDirection === 'vertical' && dragY() > 150) {
      handleClose();
    } else if (dragDirection === 'vertical') {
      setDragY(0);
    }

    // Swipe horizontal - cambiar historia
    if (dragDirection === 'horizontal') {
      const threshold = 80; // Umbral de swipe en pixels

      if (dragX() < -threshold) {
        // Swipe izquierda - siguiente
        nextHistoria();
      } else if (dragX() > threshold) {
        // Swipe derecha - anterior
        previousHistoria();
      }

      setDragX(0);
    }

    // Click rápido (sin arrastre significativo) - tap zones
    if (swipeDuration < 200 && Math.abs(dragX()) < 10 && Math.abs(dragY()) < 10) {
      const touch = (event as any).changedTouches?.[0];
      if (touch) {
        const rect = containerRef?.getBoundingClientRect();
        if (rect) {
          const x = touch.clientX - rect.left;
          const width = rect.width;

          if (x < width / 3) {
            previousHistoria();
          } else if (x > (width * 2) / 3) {
            nextHistoria();
          }
        }
      }
    }

    dragDirection = null;
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      props.onClose();
      setIsClosing(false);
      setDragY(0);
      setDragX(0);
    }, 250);
  };

  // Limpiar el estado al cerrar
  createEffect(() => {
    if (!props.isOpen) {
      setDragY(0);
      setDragX(0);
      setIsClosing(false);
      setIsPaused(false);
      setIsTransitioning(false);
      setTransitionDirection(null);
    }
  });

  // Calcular rotación del cubo 3D
  const getCubeRotation = () => {
    if (isTransitioning()) {
      return transitionDirection() === 'left' ? '-90deg' : '90deg';
    }

    if (dragDirection === 'horizontal' && dragX() !== 0) {
      const maxRotation = 90;
      const rotation = (dragX() / window.innerWidth) * maxRotation;
      return `${rotation}deg`;
    }

    return '0deg';
  };

  const getCubeTransform = () => {
    const rotation = getCubeRotation();
    const translateY = dragDirection === 'vertical' ? dragY() : 0;
    const scale = dragDirection === 'vertical' ? Math.max(0.85, 1 - dragY() / 1000) : 1;

    if (isClosing()) {
      return 'translateY(100vh) scale(0.8)';
    }

    return `translateY(${translateY}px) scale(${scale}) rotateY(${rotation})`;
  };

  return (
    <Show when={props.isOpen}>
      <div
        class="fixed inset-0 z-50 bg-black flex items-center justify-center"
        style={{
          animation: isClosing() ? 'fadeOut 0.25s ease-out' : 'fadeIn 0.3s ease-out',
        }}
      >
        {/* Contenedor con perspectiva para efecto 3D */}
        <div
          style={{
            perspective: '1000px',
            width: '100vw',
            height: '100vh',
            display: 'flex',
            'align-items': 'center',
            'justify-content': 'center',
          }}
        >
          {/* Contenido de la historia (imagen o video) */}
          <div
            ref={containerRef}
            class="relative overflow-hidden rounded-lg"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              width: '100vw',
              'aspect-ratio': '9 / 16',
              'max-height': '100vh',
              transform: getCubeTransform(),
              'transform-style': 'preserve-3d',
              opacity: isClosing() ? '0' : `${Math.max(0.5, 1 - dragY() / 500)}`,
              transition: (dragDirection === null && !isClosing()) || isTransitioning()
                ? 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease-out'
                : 'none',
              animation: !isClosing() && dragY() === 0 && dragX() === 0 && !isTransitioning()
                ? 'zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                : 'none',
            }}
          >
            {/* Barras de progreso - dentro de la imagen arriba */}
            <div class="absolute top-0 left-0 right-0 z-10 p-3">
              <div class="w-full flex gap-1 mb-3">
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

              {/* Usuario info - justo debajo de las barras */}
              <div class="flex items-center gap-2">
                <img
                  src={props.imagenPerfil}
                  alt={props.nombreUsuario}
                  class="w-8 h-8 rounded-full object-cover border-2 border-white"
                />
                <span class="text-white font-semibold text-sm">{props.nombreUsuario}</span>
              </div>
            </div>

            {/* Imagen o video de la historia */}
            {isVideo() ? (
              <video
                ref={videoRef}
                src={currentHistoria()?.url}
                class="w-full h-full object-cover"
                autoplay
                muted
                playsinline
              />
            ) : (
              <img
                src={currentHistoria()?.url}
                alt="Story"
                class="w-full h-full object-cover"
              />
            )}

            {/* Indicador visual de pausa */}
            <Show when={isPaused()}>
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div class="bg-black bg-opacity-50 rounded-full p-4">
                  <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                </div>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default StoryViewer;
