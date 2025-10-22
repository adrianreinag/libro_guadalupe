import { type Component, createSignal } from 'solid-js';
import BibleQuoteModal from './BibleQuoteModal';
import { getFraseAleatoria, type FraseBiblica } from '../../data/frasesBiblicas';

interface ButtonNavigationBarProps {
  reelsUrl?: string;
}

const ButtonNavigationBar: Component<ButtonNavigationBarProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [currentFrase, setCurrentFrase] = createSignal<FraseBiblica | null>(null);

  const handleReelsClick = () => {
    if (props.reelsUrl) {
      window.location.href = props.reelsUrl;
    }
  };

  const handleShareClick = async () => {
    const url = window.location.href;
    const title = 'Libro Guadalupe';
    const text = '¡Mira el libro de Guadalupe!';

    // Verificar si el navegador soporta Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: url,
        });
      } catch (error) {
        // Si el usuario cancela, no hacer nada
        if ((error as Error).name !== 'AbortError') {
          console.error('Error al compartir:', error);
          fallbackShare(url);
        }
      }
    } else {
      fallbackShare(url);
    }
  };

  const fallbackShare = (url: string) => {
    // Copiar al portapapeles como fallback
    navigator.clipboard.writeText(url).then(() => {
      alert('¡Enlace copiado al portapapeles!');
    }).catch(() => {
      // Si falla copiar al portapapeles, mostrar el enlace
      prompt('Copia este enlace:', url);
    });
  };

  const handleExploreClick = () => {
    const frase = getFraseAleatoria();
    setCurrentFrase(frase);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div class="max-w-2xl mx-auto flex items-center justify-between py-2 px-8">
          {/* Home */}
          <button class="p-2 hover:opacity-70 transition-opacity">
            <img src="/assets/instagram/icons/home.svg" alt="Home" class="w-7 h-7" />
          </button>

          {/* Explore */}
          <button
            class="p-2 hover:opacity-70 transition-opacity"
            onClick={handleExploreClick}
          >
            <img src="/assets/instagram/icons/explore.svg" alt="Explore" class="w-7 h-7" />
          </button>

          {/* Direct - Compartir */}
          <button
            class="p-2 hover:opacity-70 transition-opacity active:scale-95 transition-transform"
            onClick={handleShareClick}
            title="Compartir página"
          >
            <img src="/assets/instagram/icons/direct.svg" alt="Compartir" class="w-7 h-7" />
          </button>

          {/* Reel */}
          <button
            class="p-2 hover:opacity-70 transition-opacity"
            onClick={handleReelsClick}
          >
            <img src="/assets/instagram/icons/reel.svg" alt="Reel" class="w-7 h-7" />
          </button>

          {/* Profile */}
          <button class="p-2 hover:opacity-70 transition-opacity">
            <img
              src="/assets/instagram/profiles/Me_Avatar.jpg"
              alt="Profile"
              class="w-7 h-7 rounded-full object-cover"
            />
          </button>
        </div>
      </div>

      {/* Modal de Frases Bíblicas */}
      <BibleQuoteModal
        isOpen={isModalOpen()}
        frase={currentFrase()}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default ButtonNavigationBar;
