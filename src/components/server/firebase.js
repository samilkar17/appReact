import app from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyCsMeAuxvLEk0Q5w-gx5w3F85jr5DGWzGs",
  authDomain: "curso-7e516.firebaseapp.com",
  databaseURL: "https://curso-7e516.firebaseio.com",
  projectId: "curso-7e516",
  storageBucket: "curso-7e516.appspot.com",
  messagingSenderId: "113349653728",
  appId: "1:113349653728:web:d806e3688fa4fb8ddbcc85",
  measurementId: "G-YTF68RM34B",
};
class Firebase {
  constructor() {
    app.initializeApp(config);
    this.db = app.firestore();
    this.auth = app.auth();
    this.authorization = app.auth;
    this.storage = app.storage();
    this.storage.ref().constructor.prototype.guardarDocumentos = function (
      documentos
    ) {
      var ref = this;
      return Promise.all(
        documentos.map(function (file) {
          return ref
            .child(file.alias)
            .put(file)
            .then((snapshot) => {
              return ref.child(file.alias).getDownloadURL();
            });
        })
      );
    };
  }
  estaIniciado() {
    return new Promise((resolve) => {
      this.auth.onAuthStateChanged(resolve);
    });
  }
  guardarDocumento = (nombreDocumento, documento) =>
    this.storage.ref().child(nombreDocumento).put(documento);

  devolverDocumento = (documentoUrl) =>
    this.storage.ref().child(documentoUrl).getDownloadURL();

  guardarDocumentos = (documentos) =>
    this.storage.ref().guardarDocumentos(documentos);
  eliminarDocumento = (documento) =>
    this.storage.ref().child(documento).delete();
}

export default Firebase;
