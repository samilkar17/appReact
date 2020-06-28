import React, { Component } from "react";
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
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import { consumerFirebase } from "../server/context";
import { openMensajePantalla } from "../sesion/actions/snackbarAction";
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
    alignItem: "center",
    padding: "20px",
    backgroundColor: "#f5f5f5",
  },
  link: {
    display: "flex",
  },
  homeIcon: {
    width: 20,
    height: 20,
    marginRight: "4px",
  },
  submit: {
    marginTop: 15,
    marginBottom: 10,
  },
  foto: {
    height: "100px",
  },
};

class NuevoObjeto extends Component {
  state = {
    objeto: {
      direccion: "",
      ciudad: "",
      pais: "",
      descripcion: "",
      interior: "",
      fotos: [],
    },
    archivos: [],
  };

  entradaDatos = (e) => {
    let objeto_ = Object.assign({}, this.state.objeto);
    objeto_[e.target.name] = e.target.value;
    this.setState({
      objeto: objeto_,
    });
  };

  guardarObjeto = () => {
    const { archivos, objeto } = this.state;
    // crear a cada imagen o archivo, un alias
    //el alias es como se hara la invocacion y sera almacenado en la BD

    Object.keys(archivos).forEach(function (key) {
      let valorDinamico = Math.floor(new Date().getTime() / 1000);
      let nombre = archivos[key].name;
      let extension = nombre.split(".").pop();
      archivos[key].alias = (
        nombre.split(".")[0] +
        "_" +
        valorDinamico +
        "." +
        extension
      )
        .replace(/\s/g, "_")
        .toLowerCase();
    });
    const textoBusqueda =
      objeto.direccion + " " + objeto.ciudad + " " + objeto.pais;
    let keywords = crearKeyword(textoBusqueda);
    this.props.firebase.guardarDocumentos(archivos).then((arregloUrls) => {
      objeto.fotos = arregloUrls;
      objeto.keywords = keywords;

      this.props.firebase.db
        .collection("Objetos")
        .add(objeto)
        .then((success) => {
          this.props.history.push("/");
        })
        .catch((error) => {
          openMensajePantalla({
            open: true,
            mensaje: error,
          });
        });
    });
  };
  subirFotos = (documentos) => {
    Object.keys(documentos).forEach(function (key) {
      documentos[key].urlTemp = URL.createObjectURL(documentos[key]);
    });
    this.setState({
      archivos: this.state.archivos.concat(documentos),
    });
  };
  eliminarFoto = (nombreFoto) => () => {
    this.setState({
      archivos: this.state.archivos.filter((archivo) => {
        return archivo.name !== nombreFoto;
      }),
    });
  };

  render() {
    let imagenKey = uuidv4();
    return (
      <Container style={style.container}>
        <Paper style={style.paper}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" style={style.link} href="/">
                  <HomeIcon style={style.homeIcon} />
                  Home{" "}
                </Link>
                <Typography color="textPrimary"> Nuevo Inmueble</Typography>
              </Breadcrumbs>
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                name="direccion"
                label="Direccion del Inmueble"
                fullWidth
                onChange={this.entradaDatos}
                value={this.state.objeto.direccion}
              ></TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="ciudad"
                label="Ciudad"
                fullWidth
                onChange={this.entradaDatos}
                value={this.state.objeto.ciudad}
              ></TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="pais"
                label="Pais"
                fullWidth
                onChange={this.entradaDatos}
                value={this.state.objeto.pais}
              ></TextField>
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                name="descripcion"
                label="Descripcion"
                fullWidth
                multiline
                onChange={this.entradaDatos}
                value={this.state.objeto.descripcion}
              ></TextField>
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                name="interior"
                label="Descripcion del Interior"
                fullWidth
                multiline
                onChange={this.entradaDatos}
                value={this.state.objeto.interior}
              ></TextField>
            </Grid>
          </Grid>
          <Grid container justify="center" alignItems="center">
            <Grid item xs={12} sm={6}>
              <ImageUploader
                key={imagenKey}
                withIcon={true}
                buttonText="Seleccionar Imagenes"
                onChange={this.subirFotos}
                imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                maxFileSize={5242880}
              ></ImageUploader>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Table>
                <TableBody>
                  {this.state.archivos.map((archivo, i) => (
                    <TableRow key={i}>
                      <TableCell align="left">
                        <img src={archivo.urlTemp} style={style.foto} />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={this.eliminarFoto(archivo.name)}
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
          <Grid container justify="center">
            <Grid item xs={12} md={6}>
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

export default consumerFirebase(NuevoObjeto);
