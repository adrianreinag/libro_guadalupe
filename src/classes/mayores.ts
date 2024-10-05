class Mayores {
  constructor(
    public tituloDia: string,
    public himno: string,
    public salmodia: {
      salmo1: { cita: string; antifona: string; estrofas: string[] };
      salmo2: { cita: string; antifona: string; estrofas: string[] };
      salmo3: { cita: string; antifona: string; estrofas: string[] };
    },
    public lecturaBreve: { cita: string; texto: string },
    public responsorio: { v: string[]; r: string[] },
    public peticiones: {
      introduccion: string;
      respuesta: string;
      peticiones: { intencion: string; respuesta: string }[];
      comentario: string;
    },
    public oracionConclusiva: string
  ) {}

  static fromJSON(json: any, dia: string, tipo: string): Mayores {
    const datos = json[dia][tipo]; // Accedemos a la sección correcta del JSON
    return new Mayores(
      datos.tituloDia,
      datos.himno,
      datos.salmodia,
      datos.lecturaBreve,
      datos.responsorio,
      datos.peticiones,
      datos.oracionConclusiva
    );
  }
}

export class Laudes extends Mayores {
  invocacionInicial = {
    comentario:
      "Se hace la señal de la cruz sobre los labios mientras se dice:",
    verso: "Señor, ábreme los labios.",
    respuesta: "Y mi boca proclamará tu alabanza.",
    gloria:
      "Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.",
  };

  invitatorio = {
    titulo: "Salmo 94: Invitación a la alabanza divina",
    antifona: "",
    estrofas: [
      "Venid, aclamemos al Señor,\ndemos vítores a la Roca que nos salva;\nentremos a su presencia dándole gracias,\naclamándolo con cantos.",
      "Porque el Señor es un Dios grande,\nsoberano de todos los dioses:\ntiene en su mano las simas de la tierra,\nson suyas las cumbres de los montes;\nsuyo es el mar, porque él lo hizo,\nla tierra firme que modelaron sus manos.",
      "Entrad, postrémonos por tierra,\nbendiciendo al Señor, creador nuestro.\nPorque él es nuestro Dios,\ny nosotros su pueblo,\nel rebaño que él guía.",
      "Ojalá escuchéis hoy su voz:\n«No endurezcáis el corazón como en Meribá,\ncomo el día de Masá en el desierto;\ncuando vuestros padres me pusieron a prueba\ny me tentaron, aunque habían visto mis obras.",
      'Durante cuarenta años\naquella generación me asqueó, y dije:\n"Es un pueblo de corazón extraviado,\nque no reconoce mi camino;\npor eso he jurado en mi cólera\nque no entrarán en mi descanso."',
      "Gloria al Padre, y al Hijo, y al Espíritu Santo.\nComo era en el principio, ahora y siempre,\npor los siglos de los siglos. Amén.",
    ],
    comentario: "Se repite la antífona.",
  };
  canticoEvangelico = {
    comentario: "Se hace la señal de la cruz mientras se comienza a recitar:",
    antifona: "",
    estrofas: [
      "Bendito sea el Señor, Dios de Israel,\nporque ha visitado \ny redimido a su pueblo,\nsuscitándonos una fuerza \nde salvación\nen la casa de David, su siervo,\nsegún lo había predicho\ndesde antiguo\npor boca de sus santos Profetas.",
      "Es la salvación que nos libra \nde nuestros enemigos\ny de la mano de todos \nlos que nos odian;\nrealizando la misericordia\nque tuvo con nuestros padres,\nrecordando su santa alianza\ny el juramento que juró \na nuestro padre Abrahán.",
      "Para concedernos que,\nlibres de temor,\narrancados de la mano \nde los enemigos,\nle sirvamos con santidad y justicia,\nen su presencia, todos nuestros días.",
      "Y a ti, niño, \nte llamarán profeta del Altísimo,\nporque irás delante del Señor\na preparar sus caminos,\nanunciando a su pueblo la salvación,\nel perdón de sus pecados.",
      "Por la entrañable misericordia \nde nuestro Dios,\nnos visitará el sol \nque nace de lo alto,\npara iluminar \na los que viven en tinieblas\ny en sombra de muerte,\npara guiar nuestros pasos\npor el camino de la paz.",
      "Gloria al Padre, y al Hijo, \ny al Espíritu Santo.\nComo era en el principio, \nahora y siempre,\npor los siglos de los siglos. \nAmén.",
    ],
  };

  oracionDominical = {
    introduccion: "",
    texto:
      "Padre nuestro que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden. No nos dejes caer en la tentación, y líbranos del mal.",
  };
  conclusion = {
    comentario1:
      "En la recitación individual, o si el que preside no es un ministro ordenado, se concluye con la siguiente fórmula:",
    v1: "El Señor nos bendiga, nos guarde de todo mal y nos lleve a la vida eterna.",
    r1: "Amén.",
    comentario2:
      "Si el que preside es un ministro ordenado, bendice al pueblo diciendo:",
    v2: "El Señor esté con vosotros.",
    r2: "Y con tu espíritu.",
    v3: "La paz de Dios, que sobrepasa todo juicio, custodie vuestros corazones y vuestros pensamientos en el conocimiento y el amor de Dios y de su Hijo Jesucristo, nuestro Señor.",
    r3: "Amén.",
    v4: "Y la bendición de Dios todopoderoso, Padre, Hijo y Espíritu Santo, descienda sobre vosotros y os acompañe siempre.",
    r4: "Amén.",
    comentario3: "Si se despide a la asamblea, el ministro añade:",
    v5: "Podéis ir en paz.",
    r5: "Demos gracias a Dios.",
  };

  constructor(
    mayores: Mayores,
    public invitatorioAntifona: string,
    public canticoEvangelicoAntifona: string,
    public introduccionOracionDominical: string
  ) {
    super(
      mayores.tituloDia,
      mayores.himno,
      mayores.salmodia,
      mayores.lecturaBreve,
      mayores.responsorio,
      mayores.peticiones,
      mayores.oracionConclusiva
    );
    this.invitatorio.antifona = invitatorioAntifona;
    this.canticoEvangelico.antifona = canticoEvangelicoAntifona;
    this.peticiones.comentario = "Se pueden añadir algunas intenciones libres.";
    this.oracionDominical.introduccion = introduccionOracionDominical;
  }

  static fromJSON(json: any, dia: string): Laudes {
    const mayores = Mayores.fromJSON(json, dia, "laudes");
    const datos = json[dia]["laudes"];
    const laudes = new Laudes(
      mayores,
      datos.invitatorio.antifona,
      datos.canticoEvangelico.antifona,
      datos.oracionDominical.introduccion
    );
    return laudes;
  }
}

export class Visperas extends Mayores {
  invocacionInicial = {
    comentario: "Se hace la señal de la cruz mientras se dice:",
    verso: "Dios mío, ven en mi auxilio.",
    respuesta: "Señor, date prisa en socorrerme.",
    gloria:
      "Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.",
  };

  invitatorio = {
    titulo: "Salmo 94: Invitación a la alabanza divina",
    antifona: "",
    estrofas: [
      "Venid, aclamemos al Señor,\ndemos vítores a la Roca que nos salva;\nentremos a su presencia dándole gracias,\naclamándolo con cantos.",
      "Porque el Señor es un Dios grande,\nsoberano de todos los dioses:\ntiene en su mano las simas de la tierra,\nson suyas las cumbres de los montes;\nsuyo es el mar, porque él lo hizo,\nla tierra firme que modelaron sus manos.",
      "Entrad, postrémonos por tierra,\nbendiciendo al Señor, creador nuestro.\nPorque él es nuestro Dios,\ny nosotros su pueblo,\nel rebaño que él guía.",
      "Ojalá escuchéis hoy su voz:\n«No endurezcáis el corazón como en Meribá,\ncomo el día de Masá en el desierto;\ncuando vuestros padres me pusieron a prueba\ny me tentaron, aunque habían visto mis obras.",
      'Durante cuarenta años\naquella generación me asqueó, y dije:\n"Es un pueblo de corazón extraviado,\nque no reconoce mi camino;\npor eso he jurado en mi cólera\nque no entrarán en mi descanso."',
      "Gloria al Padre, y al Hijo, y al Espíritu Santo.\nComo era en el principio, ahora y siempre,\npor los siglos de los siglos. Amén.",
    ],
    comentario: "Se repite la antífona.",
  };

  canticoEvangelico = {
    comentario: "Se hace la señal de la cruz mientras se comienza a recitar:",
    antifona: "",
    estrofas: [
      "Proclama mi alma\nla grandeza del Señor,\nse alegra mi espíritu en Dios,\nmi salvador;\nporque ha mirado la humillación\nde su esclava.",
      "Desde ahora me felicitarán\ntodas las generaciones,\nporque el Poderoso ha hecho\nobras grandes por mí:\nsu nombre es santo,\ny su misericordia llega a sus fieles\nde generación en generación.",
      "Él hace proezas con su brazo:\ndispersa a los soberbios de corazón,\nderriba del trono a los poderosos\ny enaltece a los humildes,\na los hambrientos los colma de bienes\ny a los ricos los despide vacíos.",
      "Auxilia a Israel, su siervo,\nacordándose de la misericordia\n–como lo había prometido a nuestros padres–\nen favor de Abrahán\ny su descendencia por siempre.",
      "Gloria al Padre, y al Hijo,\ny al Espíritu Santo. \nComo era en el principio, \nahora y siempre, \npor los siglos de los siglos. \nAmén.",
    ],
  };

  oracionDominical = {
    introduccion: "",
    texto:
      "Padre nuestro que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden. No nos dejes caer en la tentación, y líbranos del mal.",
  };

  conclusion = {
    comentario1:
      "En la recitación individual, o si el que preside no es un ministro ordenado, se concluye con la siguiente fórmula:",
    v1: "El Señor nos bendiga, nos guarde de todo mal y nos lleve a la vida eterna.",
    r1: "Amén.",
    comentario2:
      "Si el que preside es un ministro ordenado, bendice al pueblo diciendo:",
    v2: "El Señor esté con vosotros.",
    r2: "Y con tu espíritu.",
    v3: "La paz de Dios, que sobrepasa todo juicio, custodie vuestros corazones y vuestros pensamientos en el conocimiento y el amor de Dios y de su Hijo Jesucristo, nuestro Señor.",
    r3: "Amén.",
    v4: "Y la bendición de Dios todopoderoso, Padre, Hijo y Espíritu Santo, descienda sobre vosotros y os acompañe siempre.",
    r4: "Amén.",
    comentario3: "Si se despide a la asamblea, el ministro añade:",
    v5: "Podéis ir en paz.",
    r5: "Demos gracias a Dios.",
  };

  constructor(
    mayores: Mayores,
    public canticoEvangelicoAntifona: string,
    public introduccionOracionDominical: string
  ) {
    super(
      mayores.tituloDia,
      mayores.himno,
      mayores.salmodia,
      mayores.lecturaBreve,
      mayores.responsorio,
      mayores.peticiones,
      mayores.oracionConclusiva
    );
    this.canticoEvangelico.antifona = canticoEvangelicoAntifona;
    this.oracionDominical.introduccion = introduccionOracionDominical;
    this.peticiones.comentario = "Se pueden añadir algunas intenciones libres.";
  }

  static fromJSON(json: any, dia: string): Visperas {
    const mayores = Mayores.fromJSON(json, dia, "visperas");
    const datos = json[dia]["visperas"];
    return new Visperas(mayores, datos.canticoEvangelico.antifona, datos.oracionDominical.introduccion);
  }
}
