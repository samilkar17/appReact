export const obtenerData = (firebase, paginaSize, casaInicial, texto) => {
  return new Promise(async (resolve, eject) => {
    let objetos = firebase.db
      .collection("Objetos")
      .orderBy("direccion")
      .limit(paginaSize);

    if (casaInicial !== null) {
      objetos = firebase.db
        .collection("Objetos")
        .orderBy("direccion")
        .startAfter(casaInicial)
        .limit(paginaSize);

      if (texto.trim() !== "") {
        objetos = firebase.db
          .collection("Objetos")
          .orderBy("direccion")
          .where("keywords", "array-contains", texto.toLowerCase())
          .startAfter(casaInicial)
          .limit(paginaSize);
      }
    }
    const snapshot = await objetos.get();
    const arrayObjetos = snapshot.docs.map((doc) => {
      let data = doc.data();
      let id = doc.id;
      return { id, ...data };
    });
    const inicialValor = snapshot.docs[0];
    const finalValor = snapshot.docs[snapshot.docs.length - 1];
    const returnValor = {
      arrayObjetos,
      inicialValor,
      finalValor,
    };
    resolve(returnValor);
  });
};

export const obtenerDataAnterior = (
  firebase,
  paginaSize,
  casaInicial,
  texto
) => {
  return new Promise(async (resolve, eject) => {
    let objetos = firebase.db
      .collection("Objetos")
      .orderBy("direccion")
      .limit(paginaSize);

    if (casaInicial !== null) {
      objetos = firebase.db
        .collection("Objetos")
        .orderBy("direccion")
        .startAt(casaInicial)
        .limit(paginaSize);

      if (texto.trim() !== "") {
        objetos = firebase.db
          .collection("Objetos")
          .orderBy("direccion")
          .where("keywords", "array-contains", texto.toLowerCase())
          .startAt(casaInicial)
          .limit(paginaSize);
      }
    }
    const snapshot = await objetos.get();
    const arrayObjetos = snapshot.docs.map((doc) => {
      let data = doc.data();
      let id = doc.id;
      return { id, ...data };
    });
    const inicialValor = snapshot.docs[0];
    const finalValor = snapshot.docs[snapshot.docs.length - 1];
    const returnValor = {
      arrayObjetos,
      inicialValor,
      finalValor,
    };
    resolve(returnValor);
  });
};
