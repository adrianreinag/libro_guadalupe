export interface FraseBiblica {
  frase: string;
  cita: string;
}

export const frasesBiblicas: FraseBiblica[] = [
  {
    frase: "Porque tanto amó Dios al mundo que dio a su Hijo unigénito, para que todo el que cree en él no se pierda, sino que tenga vida eterna.",
    cita: "Juan 3:16"
  },
  {
    frase: "Todo lo puedo en Cristo que me fortalece.",
    cita: "Filipenses 4:13"
  },
  {
    frase: "El Señor es mi pastor, nada me falta.",
    cita: "Salmo 23:1"
  },
  {
    frase: "Confía en el Señor de todo corazón, y no en tu propia inteligencia.",
    cita: "Proverbios 3:5"
  },
  {
    frase: "Yo soy el camino, la verdad y la vida. Nadie llega al Padre sino por mí.",
    cita: "Juan 14:6"
  },
  {
    frase: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo.",
    cita: "Isaías 41:10"
  },
  {
    frase: "Pedid, y se os dará; buscad, y hallaréis; llamad, y se os abrirá.",
    cita: "Mateo 7:7"
  },
  {
    frase: "El amor es paciente, es bondadoso. El amor no es envidioso ni jactancioso ni orgulloso.",
    cita: "1 Corintios 13:4"
  },
  {
    frase: "Vengan a mí todos ustedes que están cansados y agobiados, y yo les daré descanso.",
    cita: "Mateo 11:28"
  },
  {
    frase: "Porque donde dos o tres se reúnen en mi nombre, allí estoy yo en medio de ellos.",
    cita: "Mateo 18:20"
  },
  {
    frase: "Encomienda al Señor tu camino; confía en él, y él actuará.",
    cita: "Salmo 37:5"
  },
  {
    frase: "Jesús le dijo: Yo soy la resurrección y la vida; el que cree en mí, aunque esté muerto, vivirá.",
    cita: "Juan 11:25"
  },
  {
    frase: "El Señor está cerca de los quebrantados de corazón, y salva a los de espíritu abatido.",
    cita: "Salmo 34:18"
  },
  {
    frase: "Porque donde esté tu tesoro, allí estará también tu corazón.",
    cita: "Mateo 6:21"
  },
  {
    frase: "Si Dios está con nosotros, ¿quién contra nosotros?",
    cita: "Romanos 8:31"
  },
  {
    frase: "La paz les dejo; mi paz les doy. Yo no se la doy a ustedes como la da el mundo.",
    cita: "Juan 14:27"
  },
  {
    frase: "Ahora, pues, permanecen estas tres virtudes: la fe, la esperanza y el amor. Pero la más excelente de ellas es el amor.",
    cita: "1 Corintios 13:13"
  },
  {
    frase: "Sean fuertes y valientes. No teman ni se asusten, porque el Señor su Dios irá con ustedes.",
    cita: "Deuteronomio 31:6"
  },
  {
    frase: "Deléitate en el Señor, y él te concederá los deseos de tu corazón.",
    cita: "Salmo 37:4"
  },
  {
    frase: "Cuando pases por las aguas, yo estaré contigo; y si por los ríos, no te anegarán.",
    cita: "Isaías 43:2"
  }
];

export function getFraseAleatoria(): FraseBiblica {
  const indiceAleatorio = Math.floor(Math.random() * frasesBiblicas.length);
  return frasesBiblicas[indiceAleatorio];
}
