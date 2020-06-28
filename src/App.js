import React, { useEffect } from "react";
import "./App.css";
import ListInmuebles from "./components/views/ListInmuebles";
import Navbar from "./components/layout/Navbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./theme/theme";
import { Grid, Snackbar } from "@material-ui/core";
import RegistrarUsuario from "./components/seguridad/RegistrarUsuario";
import Login from "./components/seguridad/Login";
import { FirebaseContext } from "./components/server/index";
import { useStateValue } from "./components/sesion/store";
import RutaAutenticada from "./components/seguridad/RutaAutenticada";
import PerfilUsuario from "./components/seguridad/PerfilUsuario";
import NuevoObjeto from "./components/views/NuevoObjeto";
import EditarObjeto from "./components/views/EditarObjeto";
import LoginTelefono from "./components/seguridad/LoginTelefono";

function App(props) {
  let firebase = React.useContext(FirebaseContext);
  const [autenticacionIniciada, setupFirebaseInicial] = React.useState(false);

  const [{ openSnackbar }, dispatch] = useStateValue();

  useEffect(() => {
    firebase.estaIniciado().then((val) => {
      setupFirebaseInicial(val);
    });
  });

  return autenticacionIniciada !== false ? (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openSnackbar ? openSnackbar.open : false}
        autoHideDuration={3000}
        ContentProps={{ "aria-describedby": "message-id" }}
        message={
          <span id="message-id">
            {openSnackbar ? openSnackbar.mensaje : ""}
          </span>
        }
        onClose={() =>
          dispatch({
            type: "OPEN_SNACKBAR",
            openMensaje: {
              open: false,
              mensaje: "",
            },
          })
        }
      ></Snackbar>
      <Router>
        <MuiThemeProvider theme={theme}>
          <Navbar />
          <Grid container>
            <Switch>
              <RutaAutenticada
                path="/"
                exact
                autenticadoFirebase={firebase.auth.currentUser}
                component={ListInmuebles}
              />
              <RutaAutenticada
                path="/user/perfil"
                exact
                autenticadoFirebase={firebase.auth.currentUser}
                component={PerfilUsuario}
              />
              <RutaAutenticada
                path="/objeto/nuevoObjeto"
                exact
                autenticadoFirebase={firebase.auth.currentUser}
                component={NuevoObjeto}
              />
              <RutaAutenticada
                path="/objeto/:id"
                exact
                autenticadoFirebase={firebase.auth.currentUser}
                component={EditarObjeto}
              />
              <Route
                path="/user/registarUsuario"
                exact
                component={RegistrarUsuario}
              ></Route>
              <Route path="/user/login" exact component={Login} />
              <Route
                path="/user/loginTelefono"
                exact
                component={LoginTelefono}
              />
            </Switch>
          </Grid>
        </MuiThemeProvider>
      </Router>
    </React.Fragment>
  ) : null;
}

export default App;
