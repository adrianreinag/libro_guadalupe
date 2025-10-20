import { type Component, createSignal, createEffect, Show, onCleanup, For } from 'solid-js';
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
  const [isChangingUser, setIsChangingUser] = createSignal(false);
  const [userChangeDirection, setUserChangeDirection] = createSignal<'left' | 'right' | null>(null);
  const [prevUserData, setPrevUserData] = createSignal<{imagenPerfil: string, nombreUsuario: string, historia: HistoriaItem[]} | null>(null);

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

  // Detectar cambio de usuario y guardar datos anteriores
  createEffect(() => {
    const prevData = prevUserData();
    const currentUser = props.nombreUsuario;

    if (prevData && prevData.nombreUsuario !== currentUser) {
      // Hubo un cambio de usuario
      setIsChangingUser(true);
      setTimeout(() => {
        setIsChangingUser(false);
        setUserChangeDirection(null);
      }, 600);
    }

    // Guardar datos actuales para la próxima comparación
    setPrevUserData({
      imagenPerfil: props.imagenPerfil,
      nombreUsuario: props.nombreUsuario,
      historia: props.historia
    });
  });

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
      // Siguiente historia del MISMO usuario (transición simple)
      setCurrentHistoriaIndex(currentHistoriaIndex() + 1);
      setProgress(0);
    } else {
      // Terminaron todas las historias, cambiar de USUARIO
      if (props.onNext) {
        setUserChangeDirection('left');
        props.onNext();
      } else {
        props.onClose();
      }
      setCurrentHistoriaIndex(0);
    }
  };

  const previousHistoria = () => {
    if (currentHistoriaIndex() > 0) {
      // Historia anterior del MISMO usuario (transición simple)
      setCurrentHistoriaIndex(currentHistoriaIndex() - 1);
      setProgress(0);
    } else if (props.onPrevious) {
      // Primera historia, ir al USUARIO anterior
      setUserChangeDirection('right');
      props.onPrevious();
      setCurrentHistoriaIndex(0);
    }
  };

  // Auto-progress para imágenes con duración personalizada
  createEffect(() => {
    if (props.isOpen && !isVideo() && !isPaused() && !isChangingUser()) {
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

    // Prevenir comportamientos del navegador
    e.preventDefault();

    // Iniciar timer de long press
    longPressTimer = window.setTimeout(() => {
      setIsPaused(true);
    }, 200);
  };

  // Bloquear menú contextual del navegador
  const handleContextMenu = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const handleTouchMove = (e: TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const diffY = currentY - startY;
    const diffX = currentX - startX;

    // Determinar dirección del drag
    if (!dragDirection && (Math.abs(diffX) > 5 || Math.abs(diffY) > 5)) {
      dragDirection = Math.abs(diffX) > Math.abs(diffY) ? 'horizontal' : 'vertical';
    }

    // Prevenir pull-to-refresh cuando se arrastra hacia abajo
    if (diffY > 0) {
      e.preventDefault();
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

    // Swipe horizontal - solo para cambio de USUARIO
    if (dragDirection === 'horizontal' && !isChangingUser()) {
      // Verificar si estamos en los límites del usuario actual
      const isFirstHistoria = currentHistoriaIndex() === 0;
      const isLastHistoria = currentHistoriaIndex() === props.historia.length - 1;

      // Solo permitir drag hacia la derecha si estamos en la primera historia Y hay usuario anterior
      if (diffX > 0 && isFirstHistoria && props.onPrevious) {
        setDragX(diffX);
      }
      // Solo permitir drag hacia la izquierda si estamos en la última historia Y hay usuario siguiente
      else if (diffX < 0 && isLastHistoria && props.onNext) {
        setDragX(diffX);
      }
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

    // Swipe horizontal - solo para cambio de usuario
    if (dragDirection === 'horizontal') {
      const threshold = 100;

      if (dragX() < -threshold && currentHistoriaIndex() === props.historia.length - 1 && props.onNext) {
        // Swipe izquierda en última historia - siguiente USUARIO
        setUserChangeDirection('left');
        nextHistoria();
      } else if (dragX() > threshold && currentHistoriaIndex() === 0 && props.onPrevious) {
        // Swipe derecha en primera historia - anterior USUARIO
        setUserChangeDirection('right');
        previousHistoria();
      }

      setDragX(0);
    }

    // Click rápido (tap zones) - para historias del MISMO usuario
    if (swipeDuration < 200 && Math.abs(dragX()) < 10 && Math.abs(dragY()) < 10) {
      const touch = (event as any).changedTouches?.[0];
      if (touch) {
        const rect = containerRef?.getBoundingClientRect();
        if (rect) {
          const x = touch.clientX - rect.left;
          const width = rect.width;

          if (x < width / 3 && currentHistoriaIndex() > 0) {
            // Tap izquierda - historia anterior del MISMO usuario
            previousHistoria();
          } else if (x > (width * 2) / 3 && currentHistoriaIndex() < props.historia.length - 1) {
            // Tap derecha - siguiente historia del MISMO usuario
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
      setIsChangingUser(false);
      setUserChangeDirection(null);
    }
  });

  // Calcular rotación del cubo 3D (solo para cambio de usuario)
  const getCubeRotation = () => {
    if (isChangingUser() && userChangeDirection()) {
      return userChangeDirection() === 'left' ? -90 : 90;
    }

    // Durante el drag de cambio de usuario
    if (dragDirection === 'horizontal' && dragX() !== 0) {
      const isFirstHistoria = currentHistoriaIndex() === 0;
      const isLastHistoria = currentHistoriaIndex() === props.historia.length - 1;

      if ((dragX() > 0 && isFirstHistoria && props.onPrevious) ||
          (dragX() < 0 && isLastHistoria && props.onNext)) {
        const maxRotation = 90;
        const rotation = (dragX() / window.innerWidth) * maxRotation;
        return rotation;
      }
    }

    return 0;
  };

  const getCubeTransform = () => {
    const rotation = getCubeRotation();
    const translateY = dragDirection === 'vertical' ? dragY() : 0;
    const scale = dragDirection === 'vertical' ? Math.max(0.85, 1 - dragY() / 1000) : 1;

    if (isClosing()) {
      return 'translateY(100vh) scale(0.8)';
    }

    return `translateY(${translateY}px) scale(${scale}) rotateY(${rotation}deg)`;
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
            perspective: '1500px',
            'perspective-origin': 'center center',
            width: '100vw',
            height: '100vh',
            display: 'flex',
            'align-items': 'center',
            'justify-content': 'center',
          }}
        >
          {/* Contenido de la historia */}
          <div
            ref={containerRef}
            class="relative overflow-hidden rounded-lg"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onContextMenu={handleContextMenu}
            style={{
              'user-select': 'none',
              '-webkit-user-select': 'none',
              '-webkit-touch-callout': 'none',
              width: '100vw',
              'aspect-ratio': '9 / 16',
              'max-height': '100vh',
              transform: getCubeTransform(),
              'transform-style': 'preserve-3d',
              opacity: isClosing() ? '0' : `${Math.max(0.5, 1 - dragY() / 500)}`,
              transition: (dragDirection === null && !isClosing()) || isChangingUser()
                ? 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease-out'
                : 'none',
              animation: !isClosing() && dragY() === 0 && dragX() === 0 && !isChangingUser()
                ? 'zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                : 'none',
            }}
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

            {/* Imagen o video de la historia */}
            {isVideo() ? (
              <video
                ref={videoRef}
                src={currentHistoria()?.url}
                class="w-full h-full object-cover"
                autoplay
                muted
                playsinline
                onContextMenu={handleContextMenu}
                style={{
                  'user-select': 'none',
                  '-webkit-user-select': 'none',
                  '-webkit-touch-callout': 'none',
                  'pointer-events': 'none',
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
      </div>
    </Show>
  );
};

export default StoryViewer;
