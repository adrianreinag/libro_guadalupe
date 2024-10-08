// Interfaces para los componentes del Leccionario
interface Lectura {
    cita: string;
    titulo: string;
    texto: string;
}

interface Salmo {
    cita: string;
    antifona: string;
    versos: string[];
}

// Clase Leccionario
export class Leccionario {
    constructor(
        public dia: string,
        public primeraLectura: Lectura,
        public salmo: Salmo,
        public segundaLectura: Lectura | null,
        public evangelio: Lectura
    ) {}

  static fromJSON(json: any, dia: string): Leccionario {
    const datos = json[dia];
    const tituloDia = datos.dia;
    const primeraLectura = datos.primeraLectura;
    const salmo = datos.salmo;
    const segundaLectura = datos.segundaLectura;
    const evangelio = datos.evangelio;
    return new Leccionario(tituloDia, primeraLectura, salmo, segundaLectura, evangelio);
  }
}