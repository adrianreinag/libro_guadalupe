# Sistema de Gestión de Historias de Instagram

## Descripción

Este sistema permite gestionar historias de Instagram con las siguientes características:

1. **Programación temporal**: Cada historia tiene una fecha/hora de inicio y fin
2. **Duración personalizada**: Controla cuántos segundos se muestra cada historia
3. **Persistencia**: Las historias vistas se guardan en localStorage del navegador
4. **Múltiples historias por usuario**: Cada usuario puede tener varias historias, cada una gestionada independientemente
5. **Filtrado automático**: Solo se muestran historias activas (dentro del rango de tiempo configurado)

## Estructura de Archivos

- **`storiesConfig.ts`**: Configuración de todas las historias con fechas de publicación
- **`../utils/instagram/storiesStorage.ts`**: Utilidades para gestionar localStorage

## Cómo Agregar una Nueva Historia

### 1. Editar `storiesConfig.ts`

Encuentra el usuario al que quieres agregar la historia y añade un nuevo objeto en su array `historias`:

```typescript
{
  userId: 'delejuventud',
  imagenPerfil: '/assets/instagram/stories/La_Dele_Avatar.png',
  nombreUsuario: 'delejuventud',
  mejorAmigo: false,
  historias: [
    // Historias existentes...

    // NUEVA HISTORIA
    {
      id: 'dele_nueva_historia_1', // ID único (debe ser diferente a todas las demás)
      tipo: 'imagen', // o 'video'
      url: '/assets/instagram/posts/mi_imagen.jpg',
      duration: 5, // Duración en segundos (cuánto tiempo se mostrará)
      startDate: createDate('2025-10-20', '10:00'), // Inicio: 20 oct a las 10am
      endDate: createDate('2025-10-30', '23:59'),   // Fin: 30 oct a las 11:59pm
    },
  ],
}
```

### 2. Formato de Fechas

Usa la función `createDate(fecha, hora)`:

```typescript
createDate('2025-10-20', '14:30')  // 20 de octubre de 2025 a las 2:30pm
createDate('2025-11-05', '08:00')  // 5 de noviembre de 2025 a las 8am
createDate('2025-12-25', '00:00')  // 25 de diciembre de 2025 a medianoche
```

### 3. Duración de las Historias

El campo `duration` controla cuántos segundos se mostrará cada historia:

```typescript
duration: 3  // Historia rápida (3 segundos)
duration: 5  // Duración estándar (5 segundos) - valor por defecto
duration: 10 // Historia larga (10 segundos)
duration: 15 // Historia muy larga (15 segundos)
```

**Recomendaciones**:
- **Imágenes con poco texto**: 3-5 segundos
- **Imágenes con texto para leer**: 7-10 segundos
- **Imágenes con mucho contenido**: 10-15 segundos
- **Videos**: Usar la duración del video

### 4. Ejemplo Completo

```typescript
{
  id: 'donjesus_navidad_2025',
  tipo: 'imagen',
  url: '/assets/instagram/posts/navidad.jpg',
  duration: 7, // 7 segundos para leer el mensaje
  startDate: createDate('2025-12-24', '00:00'), // Empieza el 24 de diciembre
  endDate: createDate('2025-12-26', '23:59'),   // Termina el 26 de diciembre
}
```

## Comportamiento del Sistema

### Visualización de Historias

- **Antes del `startDate`**: La historia NO aparece
- **Entre `startDate` y `endDate`**: La historia SÍ aparece
- **Después del `endDate`**: La historia NO aparece

### Estado "Visto"

- Cuando un usuario ve una historia, se marca como vista en localStorage
- El círculo de la historia cambia de colorido a gris
- Aunque cierres y abras la app, la historia permanece como vista
- Si una historia expira (pasa el `endDate`) y luego publicas una nueva, aparecerá como no vista

### Por Usuario vs Por Historia

- Cada **historia individual** tiene su propio ID y rango de fechas
- Un **usuario** puede tener múltiples historias activas al mismo tiempo
- El usuario aparece como "visto" solo cuando **todas** sus historias activas han sido vistas

## Usuarios Disponibles

### 1. Don Jesús Obispo
- **userId**: `donjesusobispo`
- **Perfil**: `/assets/instagram/stories/Don_Jesus_Avatar.jpg`
- **Mejor amigo**: No

### 2. San Carlo Acutis
- **userId**: `sancarloacutis`
- **Perfil**: `/assets/instagram/stories/Carlo_Acutis_Avatar.jpg`
- **Mejor amigo**: Sí (círculo verde)

### 3. Dele Juventud
- **userId**: `delejuventud`
- **Perfil**: `/assets/instagram/stories/La_Dele_Avatar.png`
- **Mejor amigo**: No

## Gestión de localStorage

### Limpiar historias vistas (para testing)

Puedes abrir la consola del navegador y ejecutar:

```javascript
localStorage.removeItem('instagram_viewed_stories');
```

O desde el código:

```typescript
import { clearViewedStories } from '../../utils/instagram/storiesStorage';

clearViewedStories(); // Limpia todas las historias vistas
```

### Ver qué historias están marcadas como vistas

En la consola del navegador:

```javascript
JSON.parse(localStorage.getItem('instagram_viewed_stories'));
```

## Consejos

1. **IDs únicos**: Asegúrate de que cada historia tenga un ID único diferente
2. **Fechas coherentes**: El `endDate` debe ser posterior al `startDate`
3. **Testing**: Ajusta las fechas al presente para probar que las historias aparecen correctamente
4. **Formato de hora**: Usa formato 24 horas (ej: '14:30' para las 2:30pm)
5. **Múltiples historias**: Puedes tener varias historias activas del mismo usuario simultáneamente

## Ejemplo de Configuración Múltiple

```typescript
{
  userId: 'delejuventud',
  imagenPerfil: '/assets/instagram/stories/La_Dele_Avatar.png',
  nombreUsuario: 'delejuventud',
  mejorAmigo: false,
  historias: [
    {
      id: 'dele_historia_1',
      tipo: 'imagen',
      url: '/assets/instagram/posts/oracion.jpg',
      duration: 4, // 4 segundos - imagen simple
      startDate: createDate('2025-10-15', '08:00'),
      endDate: createDate('2025-10-25', '23:59'),
    },
    {
      id: 'dele_historia_2',
      tipo: 'imagen',
      url: '/assets/instagram/posts/devocionario.jpg',
      duration: 8, // 8 segundos - tiene texto para leer
      startDate: createDate('2025-10-20', '12:00'),
      endDate: createDate('2025-10-30', '23:59'),
    },
    {
      id: 'dele_historia_3',
      tipo: 'imagen',
      url: '/assets/instagram/posts/ubicaciones.jpg',
      duration: 10, // 10 segundos - mucha información
      startDate: createDate('2025-10-22', '10:00'),
      endDate: createDate('2025-11-01', '23:59'),
    },
  ],
}
```

En este ejemplo, si el usuario entra el 22 de octubre, verá 3 historias de Dele Juventud con diferentes duraciones.
