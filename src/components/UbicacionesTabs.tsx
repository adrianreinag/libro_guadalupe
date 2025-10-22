import { type Component, createSignal, For } from 'solid-js';

interface Ubicacion {
  nombre: string;
  url: string;
  imagen: string;
}

interface UbicacionesTabsProps {
  alia: Ubicacion[];
  guadalupe: Ubicacion[];
  rutas: Ubicacion[];
}

const UbicacionesTabs: Component<UbicacionesTabsProps> = (props) => {
  const [activeTab, setActiveTab] = createSignal(0); // 0 = Alía, 1 = Guadalupe, 2 = Rutas

  let startX = 0;
  let containerRef: HTMLDivElement | undefined;

  const currentUbicaciones = () => {
    if (activeTab() === 0) return props.alia;
    if (activeTab() === 1) return props.guadalupe;
    return props.rutas;
  };

  const handleTouchStart = (e: TouchEvent) => {
    startX = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startX;

    // Swipe derecha (retroceder)
    if (diffX > 50 && activeTab() > 0) {
      setActiveTab(activeTab() - 1);
    }
    // Swipe izquierda (avanzar)
    else if (diffX < -50 && activeTab() < 2) {
      setActiveTab(activeTab() + 1);
    }
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ 'padding-top': '80px', 'padding-bottom': '60px', 'background-color': 'white' }}
    >
      {/* TabBar */}
      <div style={{
        display: 'flex',
        'border-bottom': '1px solid #e0e0e0',
        'background-color': 'white',
      }}>
        <button
          onClick={() => setActiveTab(0)}
          style={{
            flex: 1,
            padding: '16px',
            border: 'none',
            background: 'transparent',
            'font-size': '16px',
            'font-weight': activeTab() === 0 ? '600' : '400',
            color: activeTab() === 0 ? '#000' : '#666',
            'border-bottom': activeTab() === 0 ? '2px solid #000' : '2px solid transparent',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
        >
          Alía
        </button>
        <button
          onClick={() => setActiveTab(1)}
          style={{
            flex: 1,
            padding: '16px',
            border: 'none',
            background: 'transparent',
            'font-size': '16px',
            'font-weight': activeTab() === 1 ? '600' : '400',
            color: activeTab() === 1 ? '#000' : '#666',
            'border-bottom': activeTab() === 1 ? '2px solid #000' : '2px solid transparent',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
        >
          Guadalupe
        </button>
        <button
          onClick={() => setActiveTab(2)}
          style={{
            flex: 1,
            padding: '16px',
            border: 'none',
            background: 'transparent',
            'font-size': '16px',
            'font-weight': activeTab() === 2 ? '600' : '400',
            color: activeTab() === 2 ? '#000' : '#666',
            'border-bottom': activeTab() === 2 ? '2px solid #000' : '2px solid transparent',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
        >
          Rutas
        </button>
      </div>

      {/* Grid de ubicaciones */}
      <div style={{
        display: 'grid',
        'grid-template-columns': 'repeat(3, 1fr)',
        gap: '1px',
        'background-color': 'white',
        'margin-top': '1px',
      }}>
        <For each={currentUbicaciones()}>
          {(ubi) => (
            <button
              onClick={() => window.location.href = ubi.url}
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
                src={ubi.imagen}
                alt={ubi.nombre}
                style={{
                  width: '100%',
                  'aspect-ratio': '4 / 5',
                  'object-fit': 'cover',
                  display: 'block',
                  'border-radius': '0',
                }}
              />
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
                {ubi.nombre}
              </div>
            </button>
          )}
        </For>
      </div>
    </div>
  );
};

export default UbicacionesTabs;
