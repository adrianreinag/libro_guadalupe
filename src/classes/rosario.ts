// rosario.ts
interface Misterio {
  titulo: string;
  misterios: {
    nombre: string;
    lectura: string;
    imagen: string;
  }[];
}

interface Rosario {
  [dia: string]: Misterio[];
}

export class RosarioDia {
  static ExplicacionRosario = "El Rosario es una oración tradicional católica que medita los misterios de la vida de Jesús y María.  Se compone de veinte misterios divididos en cuatro grupos: Gozosos, Dolorosos, Gloriosos y Luminosos.";
  static Inicio = "Por la señal de la santa Cruz, de nuestros enemigos líbranos Señor, Dios nuestro. En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.";
  static ActoContriccion = "Señor mío Jesucristo, Dios y Hombre verdadero, Creador, Padre y Redentor mío; por ser vos quien sois, Bondad infinita, y porque os amo sobre todas las cosas, me pesa de todo corazón haberos ofendido; propongo firmemente nunca más pecar, confesarme y cumplir la penitencia que me fuere impuesta. Ofrezco, Señor, mi vida, obras y trabajos, en satisfacción de todos mis pecados; y así como os lo suplico, así confío en vuestra divina gracia y misericordia, me perdonaréis. Amén.";
  static Comentario1 = "En cada misterio se rezan: un Padre Nuestro, diez Ave Marías y un Gloria.";
  static PadreNuestro = "Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal. Amén.";
  static AveMaria = "Dios te salve, María; llena eres de gracia; el Señor es contigo; bendita Tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros pecadores, ahora y en la hora de nuestra muerte. Amén.";
  static Gloria = "Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre por los siglos de los siglos. Amén.";
  static AveMariaPurisisma = "Ave María, purísima,";
  static SinPecadoConcebida = "sin pecado concebida.";
  static Comentario2 = "Se puede añadir una jaculatoria después de cada Gloria.";
  static MadreDeGracia = "María, Madre de gracia, Madre de misericordia, en la vida y en la muerte, ampáranos Señora nuestra. Amén.";
  static OhJesusMio = "Oh Jesús mío, perdóna nuestros pecados, líbranos del fuego del infierno, lleva a todas las almas al cielo, especialmente a las más necesitadas de tu divina misericordia. Amén.";

  constructor(public misterios: Misterio[]) {}

  static fromJSON(json: Rosario, dia: string): RosarioDia {
    const datos = json[dia];
    if (!datos) {
      throw new Error(`No se encontraron datos para el día ${dia}`);
    }
    return new RosarioDia(datos);
  }
}