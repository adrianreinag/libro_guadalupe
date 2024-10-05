// Interfaces para los componentes del Leccionario
interface Lectura {
    cita: string;
    titulo: string;
    texto: string;
}

interface Salmo {
    titulo: string;
    antifona: string;
    versos: string[];
}

// Clase Leccionario
export class Leccionario {
    constructor(
        public primeraLectura: Lectura,
        public salmo: Salmo,
        public segundaLectura: Lectura | null,
        public evangelio: Lectura
    ) {}

  static fromJSON(json: any, dia: string): Leccionario {
    const datos = json[dia];
    const primeraLectura = datos.primeraLectura;
    const salmo = datos.salmo;
    const segundaLectura = datos.segundaLectura;
    const evangelio = datos.evangelio;
    return new Leccionario(primeraLectura, salmo, segundaLectura, evangelio);
  }
}