// pwa.ts

import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  immediate: false,  // Cambiado a falso para evitar comportamiento inesperado
  onRegisteredSW(swScriptUrl: string) {
    console.log('Service Worker registrado: ', swScriptUrl);
  },
  onOfflineReady() {
    console.log('La PWA está lista para funcionar sin conexión');
  },
  onNeedRefresh() {
    // Aquí puedes implementar una notificación para que el usuario sepa que hay una nueva versión disponible
    console.log('Nueva versión disponible. Actualiza para obtener la última versión.');
  },
});
