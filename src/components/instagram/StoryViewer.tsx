import { type Component, createSignal, createEffect, Show, onCleanup, For, on } from 'solid-js';
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
  const [isClosing, setIsClosing] = createSignal(false);
  const [isPaused, setIsPaused] = createSignal(false);

  let intervalId: number | undefined;
  let videoRef: HTMLVideoElement | undefined;
  let startY = 0;
  let startX = 0;
  let longPressTimer: number | undefined;
  let containerRef: HTMLDivElement | undefined;
  let dragStartTime = 0;

  const currentHistoria = () => props.historia[currentHistoriaIndex()];
  const isVideo = () => currentHistoria()?.tipo === 'video';

  const nextHistoria = () => {
    if (currentHistoriaIndex() < props.historia.length - 1) {
      setProgress(0);
      setCurrentHistoriaIndex(currentHistoriaIndex() + 1);
    } else {
      if (props.onNext) {
        setProgress(0);
        props.onNext();
      } else {
        props.onClose();
      }
    }
  };

  const previousHistoria = () => {
    if (currentHistoriaIndex() > 0) {
      setProgress(0);
      setCurrentHistoriaIndex(currentHistoriaIndex() - 1);
    } else if (props.onPrevious) {
      setProgress(0);
      props.onPrevious();
    }
  };

  // Resetear progreso cuando cambia la historia
  createEffect(on(currentHistoriaIndex, () => {
    if (props.isOpen) {
      setProgress(0);
    }
  }));

  // Marcar como vista
  createEffect(() => {
    if (props.isOpen) {
      const historia = currentHistoria();
      if (historia?.id) {
        markStoryAsViewed(historia.id);
      }
    }
  });

  // Auto-progress para imágenes
  createEffect(() => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = undefined;
    }

    if (props.isOpen && !isVideo() && !isPaused()) {
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
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = undefined;
      }
    };
  });

  // Manejar videos
  createEffect(() => {
    if (props.isOpen && isVideo() && videoRef && !isPaused()) {
      // Reiniciar el video desde el principio
      videoRef.currentTime = 0;
      setProgress(0);
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

  // Resetear al cerrar
  createEffect(() => {
    if (!props.isOpen) {
      setCurrentHistoriaIndex(0);
      setProgress(0);
      setDragY(0);
      setIsClosing(false);
      setIsPaused(false);
    }
  });

  // Interceptar botón atrás
  createEffect(() => {
    if (props.isOpen) {
      window.history.pushState({ storyViewerOpen: true }, '');

      const handlePopState = () => {
        handleClose();
      };

      window.addEventListener('popstate', handlePopState);

      onCleanup(() => {
        window.removeEventListener('popstate', handlePopState);
        if (window.history.state?.storyViewerOpen) {
          window.history.back();
        }
      });
    }
  });

  // Bloquear pull-to-refresh cuando el StoryViewer está abierto
  createEffect(() => {
    if (props.isOpen) {
      // Guardar el estilo original del body y html
      const originalBodyOverscroll = document.body.style.overscrollBehavior;
      const originalBodyTouchAction = document.body.style.touchAction;
      const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior;
      const originalBodyPosition = document.body.style.position;

      // Bloquear pull-to-refresh de múltiples formas
      document.body.style.overscrollBehavior = 'none';
      document.body.style.touchAction = 'none';
      document.documentElement.style.overscrollBehavior = 'none';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';

      // Prevenir el touchmove que causa pull-to-refresh
      const preventPullToRefresh = (e: TouchEvent) => {
        // Siempre prevenir si estamos en el StoryViewer
        const target = e.target as HTMLElement;
        if (target.closest('.story-viewer-container')) {
          // Solo permitir el touchmove que maneja el StoryViewer internamente
          return;
        }
        e.preventDefault();
      };

      document.addEventListener('touchmove', preventPullToRefresh, { passive: false });

      onCleanup(() => {
        // Restaurar estilos originales
        document.body.style.overscrollBehavior = originalBodyOverscroll;
        document.body.style.touchAction = originalBodyTouchAction;
        document.documentElement.style.overscrollBehavior = originalHtmlOverscroll;
        document.body.style.position = originalBodyPosition;
        document.body.style.width = '';

        document.removeEventListener('touchmove', preventPullToRefresh);
      });
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

  const handleTouchStart = (e: TouchEvent) => {
    startY = e.touches[0].clientY;
    startX = e.touches[0].clientX;
    dragStartTime = Date.now();

    e.preventDefault();

    // Long press para pausar
    longPressTimer = window.setTimeout(() => {
      setIsPaused(true);
    }, 200);
  };

  const handleContextMenu = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const handleTouchMove = (e: TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const diffY = currentY - startY;

    if (diffY > 0) {
      e.preventDefault();
    }

    // Cancelar long press si hay movimiento
    if (longPressTimer && Math.abs(diffY) > 10) {
      clearTimeout(longPressTimer);
      longPressTimer = undefined;
    }

    // Swipe vertical hacia abajo
    if (diffY > 0) {
      const resistance = diffY > 200 ? 0.5 : 1;
      setDragY(diffY * resistance);
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    // Limpiar long press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = undefined;
    }

    // Reanudar
    setIsPaused(false);

    const swipeDuration = Date.now() - dragStartTime;

    // Swipe vertical - cerrar
    if (dragY() > 150) {
      handleClose();
      setDragY(0);
      return;
    } else if (dragY() > 0) {
      setDragY(0);
    }

    // Tap rápido - detectar zona
    if (swipeDuration < 200 && Math.abs(dragY()) < 10) {
      const touch = e.changedTouches?.[0];
      if (touch) {
        const rect = containerRef?.getBoundingClientRect();
        if (rect) {
          const x = touch.clientX - rect.left;
          const width = rect.width;

          // 40% izquierda: retroceder
          if (x < width * 0.4) {
            previousHistoria();
          }
          // 60% derecha: avanzar
          else {
            nextHistoria();
          }
        }
      }
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      props.onClose();
      setIsClosing(false);
      setDragY(0);
    }, 250);
  };

  return (
    <Show when={props.isOpen}>
      <div
        class="fixed inset-0 z-50 bg-black flex items-center justify-center story-viewer-container"
        style={{
          animation: isClosing() ? 'fadeOut 0.25s ease-out' : 'fadeIn 0.3s ease-out',
          'overscroll-behavior': 'none',
          'touch-action': 'none',
        }}
      >
        <div
          ref={containerRef}
          class="relative w-full h-full overflow-hidden"
          style={{
            width: '100vw',
            height: 'calc(100vw * 16 / 9)',
            'max-height': '100vh',
            transform: `translateY(${dragY()}px)`,
            opacity: isClosing() ? '0' : `${Math.max(0.5, 1 - dragY() / 500)}`,
            'will-change': dragY() > 0 ? 'transform, opacity' : 'auto',
            transition: isClosing()
              ? 'opacity 0.3s ease-out, transform 0.3s ease-out'
              : dragY() === 0
                ? 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.2s ease-out'
                : 'none',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onContextMenu={handleContextMenu}
        >
          {/* Barras de progreso */}
          <div class="absolute top-0 left-0 right-0 z-10 p-3">
            <div class="w-full flex gap-1 mb-3">
              <For each={props.historia}>
                {(_, index) => (
                  <div class="flex-1 h-[2px] bg-gray-600 bg-opacity-50 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-white transition-all duration-100"
                      style={{
                        width: index() === currentHistoriaIndex()
                          ? `${progress()}%`
                          : index() < currentHistoriaIndex()
                            ? '100%'
                            : '0%'
                      }}
                    />
                  </div>
                )}
              </For>
            </div>

            {/* Usuario info */}
            <div class="flex items-center gap-2">
              <img
                src={props.imagenPerfil}
                alt={props.nombreUsuario}
                class="w-8 h-8 rounded-full object-cover border-2 border-white"
              />
              <span class="text-white font-semibold text-sm">{props.nombreUsuario}</span>
            </div>
          </div>

          {/* Imagen o video */}
          {isVideo() ? (
            <video
              ref={videoRef}
              src={currentHistoria()?.url}
              class="w-full h-full object-contain"
              autoplay
              playsinline
              onContextMenu={handleContextMenu}
              style={{
                'user-select': 'none',
                '-webkit-user-select': 'none',
                '-webkit-touch-callout': 'none',
                'pointer-events': 'none',
                'background-color': 'black',
              }}
            />
          ) : (
            <img
              src={currentHistoria()?.url}
              alt="Story"
              class="w-full h-full object-cover"
              onContextMenu={handleContextMenu}
              style={{
                'user-select': 'none',
                '-webkit-user-select': 'none',
                '-webkit-touch-callout': 'none',
                'pointer-events': 'none',
              }}
              draggable={false}
            />
          )}
        </div>
      </div>
    </Show>
  );
};

export default StoryViewer;
