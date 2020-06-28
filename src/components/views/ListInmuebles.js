import React, { Component } from "react";
import {
  Container,
  Paper,
  Grid,
  Breadcrumbs,
  Link,
  Typography,
  TextField,
  CardMedia,
  Card,
  CardContent,
  CardActions,
  Button,
  ButtonGroup,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import { consumerFirebase } from "../server/context";
import logo from "../../logo.svg";
import ArrowLeft from "@material-ui/icons/ArrowLeft";
import ArrowRight from "@material-ui/icons/ArrowRight";
import { obtenerData, obtenerDataAnterior } from "../sesion/actions/Inmueble";

const style = {
  cardGrid: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  paper: {
    backgroundColor: "#f5f5f5",
    padding: "20px",
    marginTop: "20px",
    minHeight: 650,
  },
  link: {
    display: "flex",
  },
  gridTextflied: {
    marginTop: "20px",
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%",
  },
  cardContent: {
    flexGrow: 1,
  },
  barraBoton: {
    marginTop: "20px",
  },
};
class ListInmuebles extends Component {
  state = {
    objetos: [],
    textoBusqueda: "",
    paginas: [],
    paginaSize: 1,
    casaInicial: null,
    paginaActual: 0,
  };
  siguientePagina = () => {
    const {
      paginaActual,
      paginaSize,
      textoBusqueda,
      paginas,
      casaInicial,
    } = this.state;
    const firebase = this.props.firebase;
    obtenerData(
      firebase,
      paginaSize,
      paginas[paginaActual].finalValor,
      textoBusqueda
    ).then((firebaseReturnData) => {
      if (firebaseReturnData.arrayObjetos.length > 0) {
        const pagina = {
          inicialValor: firebaseReturnData.inicialValor,
          finalValor: firebaseReturnData.finalValor,
        };
        paginas.push(pagina);
        this.setState({
          pagina,
          paginaActual: paginaActual + 1,
          objetos: firebaseReturnData.arrayObjetos,
        });
      }
    });
  };
  anteriorPagina = () => {
    const { paginaActual, paginaSize, textoBusqueda, paginas } = this.state;
    if (paginaActual > 0) {
      const firebare = this.props.firebase;
      obtenerDataAnterior(
        firebare,
        paginaSize,
        paginas[paginaActual - 1].inicialValor,
        textoBusqueda
      ).then((firebaseReturnData) => {
        const pagina = {
          inicalValor: firebaseReturnData.inicialValor,
          finalValor: firebaseReturnData.finalValor,
        };
        paginas.push(pagina);
        this.setState({
          paginas,
          paginaActual: paginaActual - 1,
          objetos: firebaseReturnData.arrayObjetos,
        });
      });
    }
  };
  cambiarBusquedaTexto = (e) => {
    const self = this;
    self.setState({
      [e.target.name]: e.target.value,
    });

    if (self.state.typingTimeout) {
      clearTimeout(self.state.typingTimeout);
    }
    self.setState({
      name: e.target.value,
      typing: false,
      typingTimeout: setTimeout((goTime) => {
        const firebase = this.props.firebase;
        const { paginaSize } = this.state;
        obtenerDataAnterior(
          firebase,
          paginaSize,
          0,
          self.state.textoBusqueda
        ).then((firebaseReturnData) => {
          const pagina = {
            inicialValor: firebaseReturnData.inicialValor,
            finalValor: firebaseReturnData.finalValor,
          };
          const paginas = [];
          paginas.push(pagina);
          this.setState({
            paginaActual: 0,
            paginas,
            objetos: firebaseReturnData.arrayObjetos,
          });
        });
      }, 500),
    });
  };
  async componentDidMount() {
    const { paginaSize, textoBusqueda, casaInicial, paginas } = this.state;
    const firebase = this.props.firebase;
    const firebaseReturnData = await obtenerData(
      firebase,
      paginaSize,
      casaInicial,
      textoBusqueda
    );

    const pagina = {
      inicialValor: firebaseReturnData.inicialValor,
      finalValor: firebaseReturnData.finalValor,
    };
    paginas.push(pagina);
    this.setState({
      objetos: firebaseReturnData.arrayObjetos,
      paginas,
      paginaActual: 0,
    });
  }

  editarObjeto = (id) => {
    this.props.history.push("/objeto/" + id);
  };
  eliminarObjeto = (id) => {
    this.props.firebase.db
      .collection("Objetos")
      .doc(id)
      .delete()
      .then((success) => {
        this.eliminardeLista(id);
      });
  };
  eliminardeLista = (id) => {
    const objetolistanueva = this.state.objetos.filter(
      (objeto) => objeto.id !== id
    );
    this.setState({
      objetos: objetolistanueva,
    });
  };
  render() {
    return (
      <Container style={style.ardGrid}>
        <Paper style={style.paper}>
          <Grid item>
            <Breadcrumbs arial-label="breadcrumbs">
              <Link color="inherit" style={style.link} href="/">
                <HomeIcon>Home</HomeIcon>
              </Link>
              <Typography color="textPrimary">Lista de Inmuebles</Typography>
            </Breadcrumbs>
          </Grid>
          <Grid style={style.gridTextflied}>
            <TextField
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              name="textoBusqueda"
              variant="outlined"
              label="Busqueda por Direccion"
              onChange={this.cambiarBusquedaTexto}
              value={this.textoBusqueda}
            />
          </Grid>
          <Grid item xs={12} sm={12} style={style.barraBoton}>
            <Grid
              container
              spacing={1}
              direction="column"
              alignItems="flex-end"
            >
              <ButtonGroup size="small" aria-label="Small outlined group">
                <Button>
                  <ArrowLeft onClick={this.anteriorPagina} />
                </Button>
                <Button onClick={this.siguientePagina}>
                  <ArrowRight />
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={4}>
              {this.state.objetos.map((card) => (
                <Grid
                  item
                  key={card.id}
                  xs={12}
                  sm={6}
                  md={4}
                  style={style.gridTextflied}
                >
                  <Card style={style.card}>
                    <CardMedia
                      style={style.cardMedia}
                      image={
                        card.fotos
                          ? card.fotos[0]
                            ? card.fotos[0]
                            : logo
                          : logo
                      }
                      title={"Mi Objeto"}
                    />

                    <CardContent style={style.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {card.ciudad + ", " + card.pais}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => this.editarObjeto(card.id)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        color="secondary"
                        onClick={() => this.eliminarObjeto(card.id)}
                      >
                        Eliminar
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }
}

export default consumerFirebase(ListInmuebles);
