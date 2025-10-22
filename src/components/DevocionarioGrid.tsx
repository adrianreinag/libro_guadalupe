import { type Component, For } from 'solid-js';

interface Devocionario {
  nombre: string;
  url: string;
  imagen: string;
  needsDateCalculation?: boolean;
}

interface DevocionarioGridProps {
  devocionarios: Devocionario[];
}

const DevocionarioGrid: Component<DevocionarioGridProps> = (props) => {
  const getDia = () => {
    const today = new Date();
    const date = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();

    if (
      year < 2024 ||
      (year === 2024 && month < 9) ||
      (year === 2024 && month === 9 && date < 19)
    ) {
      return "viernes";
    } else if (year === 2024 && month === 9 && date === 19) {
      return "sabado";
    } else {
      return "domingo";
    }
  };

  const handleClick = (devo: Devocionario) => {
    let url = devo.url;
    if (devo.needsDateCalculation) {
      url = `${url}/${getDia()}`;
    }
    window.location.href = url;
  };

  return (
    <div
      style={{
        'padding-top': '80px',
        'padding-bottom': '60px',
        'background-color': 'white',
        'min-height': '100vh',
      }}
    >
      {/* Grid de devocionarios */}
      <div style={{
        display: 'grid',
        'grid-template-columns': 'repeat(3, 1fr)',
        gap: '1px',
        'background-color': 'white',
      }}>
        <For each={props.devocionarios}>
          {(devo) => (
            <button
              onClick={() => handleClick(devo)}
              onContextMenu={(e) => e.preventDefault()}
              style={{
                width: '100%',
                position: 'relative',
                'background-color': 'transparent',
                overflow: 'hidden',
                border: 'none',
                padding: '0',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <img
                src={devo.imagen}
                alt={devo.nombre}
                style={{
                  width: '100%',
                  'aspect-ratio': '1 / 1',
                  'object-fit': 'cover',
                  display: 'block',
                  'border-radius': '0',
                }}
              />
              {/* Capa de oscuridad */}
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                'background-color': 'rgba(0, 0, 0, 0.3)',
                'pointer-events': 'none',
              }} />
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                padding: '16px',
                'font-size': '14px',
                'font-weight': '600',
                'text-align': 'center',
                color: 'white',
                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)',
                'font-family': '"Inter", sans-serif',
              }}>
                {devo.nombre}
              </div>
            </button>
          )}
        </For>
      </div>
    </div>
  );
};

export default DevocionarioGrid;
