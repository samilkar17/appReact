import React, { Component } from "react";
import { consumerFirebase } from "../server/context";
import {
  Container,
  Paper,
  Grid,
  Breadcrumbs,
  Link,
  Typography,
  TextField,
  Button,
  Table,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import ImageUploader from "react-images-upload";
import { v4 as uuidv4 } from "uuid";
import { crearKeyword } from "../sesion/actions/Keyword";
const style = {
  container: {
    paddingTop: "8px",
  },
  paper: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f5f5f5",
  },
  link: {
    backgroundColor: "#f5f5f5",
    display: "flex",
  },
  homeicon: {
    width: 20,
    height: 20,
    marginRight: "4px",
  },
  submit: {
    marginTop: 15,
    marginBottom: 10,
  },
  fotoObjeto: {
    height: "100px",
  },
};
class EditarObjeto extends Component {
  state = {
    objeto: {
      direccion: "",
      ciudad: "",
      pais: "",
      descripcion: "",
      interior: "",
      foto: [],
    },
  };
  cambiarDato = (e) => {
    let objeto = Object.assign({}, this.state.objeto);
    objeto[e.target.name] = e.target.value;
    this.setState({ objeto });
  };
  subirImagenes = (imagenes) => {
    const { objeto } = this.state;
    const { id } = this.props.match.params;
    //agregar un nombre dinamico por cada imagen que necesita subir a l DB
    Object.keys(imagenes).forEach((key) => {
      let numeroDinamico = uuidv4();
      let nombreImagen = imagenes[key].name;
      let extension = nombreImagen.split(".").pop();
      imagenes[key].alias = (
        nombreImagen.split(".")[0] +
        "_" +
        numeroDinamico +
        "." +
        extension
      )
        .replace(/\s/g, "_")
        .toLowerCase();
    });
    this.props.firebase.guardarDocumentos(imagenes).then((urlImagenes) => {
      objeto.fotos = objeto.fotos.concat(urlImagenes);
      this.props.firebase.db
        .collection("Objetos")
        .doc(id)
        .set(objeto, { merge: true })
        .then((success) => {
          this.setState({
            objeto,
          });
        });
    });
  };
  eliminarFoto = (fotoUrl) => async () => {
    const { objeto } = this.state;
    const { id } = this.props.match.params;
    let fotoID = fotoUrl.match(/[\w-]+.(jpg|png|jepg|gif|svg)/);
    fotoID = fotoID[0];
    await this.props.firebase.eliminarDocumento(fotoID);

    let fotosList = this.state.objeto.fotos.filter((foto) => {
      return foto !== fotoUrl;
    });
    objeto.fotos = fotosList;
    this.props.firebase.db
      .collection("Objetos")
      .doc(id)
      .set(objeto, { merge: true })
      .then((success) => {
        this.setState({
          objeto,
        });
      });
  };

  async componentDidMount() {
    const { id } = this.props.match.params;
    const objetoCollection = this.props.firebase.db.collection("Objetos");
    const objetoDB = await objetoCollection.doc(id).get();

    this.setState({
      objeto: objetoDB.data(),
    });
  }
  guardarObjeto = () => {
    const { objeto } = this.state;
    const { id } = this.props.match.params; //permite obtener id
    const textoBusqueda =
      objeto.direccion + " " + objeto.ciudad + " " + objeto.pais;
    const keywords = crearKeyword(textoBusqueda);

    objeto.keywords = keywords;
    this.props.firebase.db
      .collection("Objetos")
      .doc(id)
      .set(objeto, { merge: true })
      .then((success) => {
        this.props.history.push("/");
      });
  };
  render() {
    let uniqueID = uuidv4();
    return (
      <Container style={style.container}>
        <Paper style={style.paper}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" style={style.link} href="/">
                  <HomeIcon style={style.homeicon} />
                  Home
                </Link>
                <Typography color="textPrimary">Editar Inmueble</Typography>
              </Breadcrumbs>
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                name="direccion"
                label="Direccion del Inmueble"
                fullWidth
                onChange={this.cambiarDato}
                value={this.state.objeto.direccion}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="ciudad"
                label="Ciudad"
                fullWidth
                onChange={this.cambiarDato}
                value={this.state.objeto.ciudad}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="pais"
                label="Pais"
                fullWidth
                onChange={this.cambiarDato}
                value={this.state.objeto.pais}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                name="descripcion"
                label="Descripcion del Inmueble"
                fullWidth
                multiline
                onChange={this.cambiarDato}
                value={this.state.objeto.descripcion}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                name="interior"
                label="Descripcion del Interior"
                fullWidth
                multiline
                onChange={this.cambiarDato}
                value={this.state.objeto.interior}
              />
            </Grid>
          </Grid>
          <Grid container justify="center">
            <Grid item xs={12} sm={6}>
              <ImageUploader
                key={uniqueID}
                withIcon={true}
                onChange={this.subirImagenes}
                buttonText="Seleccionar Imagen"
                imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Table>
                <TableBody>
                  {this.state.objeto.fotos
                    ? this.state.objeto.fotos.map((foto, i) => (
                        <TableRow key={i}>
                          <TableCell align="left">
                            <img src={foto} style={style.fotoObjeto} />
                          </TableCell>
                          <TableCell align="left">
                            <Button
                              variant="contained"
                              color="secondary"
                              size="small"
                              onClick={this.eliminarFoto(foto)}
                            >
                              Eliminar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    : ""}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
          <Grid container justify="center">
            <Grid item xs={12} sm={6}>
              <Button
                type="button"
                fullWidth
                variant="contained"
                size="large"
                color="primary"
                style={style.submit}
                onClick={this.guardarObjeto}
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }
}

export default consumerFirebase(EditarObjeto);
