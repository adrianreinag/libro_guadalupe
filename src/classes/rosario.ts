interface Misterio {
  nombre: string;
  lectura: string;
  imagen: string;
}

interface MisteriosDia {
  titulo: string;
  misterios: Misterio[];
}

interface Rosario {
  [dia: string]: MisteriosDia;
}

export class RosarioDia {
  constructor(public titulo: string, public misterios: Misterio[]) {}

  static fromJSON(json: Rosario, dia: string): RosarioDia {
    const datosDia = json[dia];
    if (!datosDia) {
      throw new Error(`No se encontraron datos para el día ${dia}`);
    }
    return new RosarioDia(datosDia.titulo, datosDia.misterios);
  }
}
