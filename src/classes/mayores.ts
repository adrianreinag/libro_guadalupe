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
    public oracionConclusiva: string,
    public cantoVirgen: string
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
      datos.oracionConclusiva,
      datos.cantoVirgen
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
      "Venid, aclamemos al Señor,<br>demos vítores a la Roca que nos salva;<br>entremos a su presencia dándole gracias,<br>aclamándolo con cantos.",
      "Porque el Señor es un Dios grande,<br>soberano de todos los dioses:<br>tiene en su mano las simas de la tierra,<br>son suyas las cumbres de los montes;<br>suyo es el mar, porque él lo hizo,<br>la tierra firme que modelaron sus manos.",
      "Entrad, postrémonos por tierra,<br>bendiciendo al Señor, creador nuestro.<br>Porque él es nuestro Dios,<br>y nosotros su pueblo,<br>el rebaño que él guía.",
      "Ojalá escuchéis hoy su voz:<br>«No endurezcáis el corazón como en Meribá,<br>como el día de Masá en el desierto;<br>cuando vuestros padres me pusieron a prueba<br>y me tentaron, aunque habían visto mis obras.",
      'Durante cuarenta años<br>aquella generación me asqueó, y dije:<br>"Es un pueblo de corazón extraviado,<br>que no reconoce mi camino;<br>por eso he jurado en mi cólera<br>que no entrarán en mi descanso."',
      "Gloria al Padre, y al Hijo, y al Espíritu Santo.<br>Como era en el principio, ahora y siempre,<br>por los siglos de los siglos. Amén.",
    ],
    comentario: "Se repite la antífona.",
  };
  canticoEvangelico = {
    comentario: "Se hace la señal de la cruz mientras se comienza a recitar:",
    antifona: "",
    estrofas: [
      "Bendito sea el Señor, Dios de Israel,<br>porque ha visitado <br>y redimido a su pueblo,<br>suscitándonos una fuerza <br>de salvación<br>en la casa de David, su siervo,<br>según lo había predicho<br>desde antiguo<br>por boca de sus santos Profetas.",
      "Es la salvación que nos libra <br>de nuestros enemigos<br>y de la mano de todos <br>los que nos odian;<br>realizando la misericordia<br>que tuvo con nuestros padres,<br>recordando su santa alianza<br>y el juramento que juró <br>a nuestro padre Abrahán.",
      "Para concedernos que,<br>libres de temor,<br>arrancados de la mano <br>de los enemigos,<br>le sirvamos con santidad y justicia,<br>en su presencia, todos nuestros días.",
      "Y a ti, niño, <br>te llamarán profeta del Altísimo,<br>porque irás delante del Señor<br>a preparar sus caminos,<br>anunciando a su pueblo la salvación,<br>el perdón de sus pecados.",
      "Por la entrañable misericordia <br>de nuestro Dios,<br>nos visitará el sol <br>que nace de lo alto,<br>para iluminar <br>a los que viven en tinieblas<br>y en sombra de muerte,<br>para guiar nuestros pasos<br>por el camino de la paz.",
      "Gloria al Padre, y al Hijo, <br>y al Espíritu Santo.<br>Como era en el principio, <br>ahora y siempre,<br>por los siglos de los siglos. <br>Amén.",
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
      mayores.oracionConclusiva,
      mayores.cantoVirgen
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
      "Venid, aclamemos al Señor,<br>demos vítores a la Roca que nos salva;<br>entremos a su presencia dándole gracias,<br>aclamándolo con cantos.",
      "Porque el Señor es un Dios grande,<br>soberano de todos los dioses:<br>tiene en su mano las simas de la tierra,<br>son suyas las cumbres de los montes;<br>suyo es el mar, porque él lo hizo,<br>la tierra firme que modelaron sus manos.",
      "Entrad, postrémonos por tierra,<br>bendiciendo al Señor, creador nuestro.<br>Porque él es nuestro Dios,<br>y nosotros su pueblo,<br>el rebaño que él guía.",
      "Ojalá escuchéis hoy su voz:<br>«No endurezcáis el corazón como en Meribá,<br>como el día de Masá en el desierto;<br>cuando vuestros padres me pusieron a prueba<br>y me tentaron, aunque habían visto mis obras.",
      'Durante cuarenta años<br>aquella generación me asqueó, y dije:<br>"Es un pueblo de corazón extraviado,<br>que no reconoce mi camino;<br>por eso he jurado en mi cólera<br>que no entrarán en mi descanso."',
      "Gloria al Padre, y al Hijo, y al Espíritu Santo.<br>Como era en el principio, ahora y siempre,<br>por los siglos de los siglos. Amén.",
    ],
    comentario: "Se repite la antífona.",
  };

  canticoEvangelico = {
    comentario: "Se hace la señal de la cruz mientras se comienza a recitar:",
    antifona: "",
    estrofas: [
      "Proclama mi alma<br>la grandeza del Señor,<br>se alegra mi espíritu en Dios,<br>mi salvador;<br>porque ha mirado la humillación<br>de su esclava.",
      "Desde ahora me felicitarán<br>todas las generaciones,<br>porque el Poderoso ha hecho<br>obras grandes por mí:<br>su nombre es santo,<br>y su misericordia llega a sus fieles<br>de generación en generación.",
      "Él hace proezas con su brazo:<br>dispersa a los soberbios de corazón,<br>derriba del trono a los poderosos<br>y enaltece a los humildes,<br>a los hambrientos los colma de bienes<br>y a los ricos los despide vacíos.",
      "Auxilia a Israel, su siervo,<br>acordándose de la misericordia<br>–como lo había prometido a nuestros padres–<br>en favor de Abrahán<br>y su descendencia por siempre.",
      "Gloria al Padre, y al Hijo,<br>y al Espíritu Santo. <br>Como era en el principio, <br>ahora y siempre, <br>por los siglos de los siglos. <br>Amén.",
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
      mayores.oracionConclusiva,
      mayores.cantoVirgen
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
