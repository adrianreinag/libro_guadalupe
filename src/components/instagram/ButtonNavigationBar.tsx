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

          {/* Post */}
          <button class="p-2 hover:opacity-70 transition-opacity">
            <img src="/assets/instagram/icons/post.svg" alt="Post" class="w-7 h-7" />
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
              src="/assets/instagram/stories/Me_Avatar.jpg"
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
