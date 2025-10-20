import { type Component, Show } from 'solid-js';
import type { FraseBiblica } from '../../data/frasesBiblicas';

interface BibleQuoteModalProps {
  isOpen: boolean;
  frase: FraseBiblica | null;
  onClose: () => void;
}

const BibleQuoteModal: Component<BibleQuoteModalProps> = (props) => {
  return (
    <Show when={props.isOpen && props.frase}>
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        onClick={props.onClose}
        style={{
          animation: 'fadeIn 0.3s ease-out',
        }}
      >
        <div
          class="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
          style={{
            animation: 'zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Content */}
          <div class="space-y-4">
            <p class="text-gray-700 text-base leading-relaxed italic">
              "{props.frase?.frase}"
            </p>
            <p class="text-right text-sm font-semibold text-gray-600">
              — {props.frase?.cita}
            </p>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default BibleQuoteModal;
