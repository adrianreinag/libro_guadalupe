// Interfaces para los cantos
interface Canto {
  titulo: string | null;
  letra: string | null;
}

// Clase Cantos
export class Cantos {
  constructor(
    public entrada: Canto | null,
    public aleluya: Canto | null,
    public ofertorio: Canto | null,
    public comunion: Canto[] | null,
    public accionGracias: Canto | null,
    public virgen: Canto | null
  ) {}

  static fromJSON(json: any, dia: string): Cantos | null {
    const datos = json[dia];
    if (!datos) {
      return null;
    }

    const entrada = datos.entrada || null;
    const aleluya = datos.aleluya || null;
    const ofertorio = datos.ofertorio || null;
    const comunion = Array.isArray(datos.comunion) ? datos.comunion : null;
    const accionGracias = datos.accionGracias || null;
    const virgen = datos.virgen || null;

    return new Cantos(entrada, aleluya, ofertorio, comunion, accionGracias, virgen);
  }
}
