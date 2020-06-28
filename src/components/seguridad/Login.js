import React, { Component } from "react";
import {
  Avatar,
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Grid,
} from "@material-ui/core";
import LockOutLineIcon from "@material-ui/icons/LockOutlined";
import { compose } from "recompose";
import { consumerFirebase } from "../server/context";
import { iniciarSesion } from "../sesion/actions/sesionAction";
import { openMensajePantalla } from "../sesion/actions/snackbarAction";
import { StateContext } from "../sesion/store";

const style = {
  paper: {
    marginTop: 9,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: 5,
    backgroundColor: "#e53935",
  },
  form: {
    width: "100%",
    marginTop: 8,
  },
  submit: {
    marginTop: 10,
    marginBottom: 20,
  },
};
class Login extends Component {
  static contextType = StateContext;
  state = {
    firebase: null,
    usuario: {
      email: "",
      password: "",
    },
  };
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.firebase === prevState.firebase) {
      return null;
    }
    return {
      firebase: nextProps.firebase,
    };
  }
  onChange = (e) => {
    let usuario = Object.assign({}, this.state.usuario);
    usuario[e.target.name] = e.target.value;
    this.setState({
      usuario: usuario,
    });
  };
  login = async (e) => {
    e.preventDefault();
    const [{ sesion }, dispatch] = this.context;
    const { firebase, usuario } = this.state;
    const { email, password } = usuario;

    let callback = await iniciarSesion(dispatch, firebase, email, password);

    if (callback.status) {
      this.props.history.push("/");
    } else {
      openMensajePantalla(dispatch, {
        open: true,
        mensaje: callback.mensaje.message,
      });
    }
  };

  resetearPass = () => {
    const { firebase, usuario } = this.state;
    const [{ sesion }, dispatch] = this.context;
    firebase.auth
      .sendPasswordResetEmail(usuario.email)
      .then((success) => {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: "Se ha enviado un correo electronico a tu cuenta",
        });
      })
      .catch((error) => {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: error.message,
        });
      });
  };
  render() {
    return (
      <Container maxWidth="xs">
        <div style={style.paper}>
          <Avatar style={style.avatar}>
            <LockOutLineIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Ingrese usuario
          </Typography>
          <form style={style.form}>
            <TextField
              variant="outlined"
              label="E-Mail"
              name="email"
              fullWidth
              margin="normal"
              onChange={this.onChange}
              value={this.state.usuario.email}
            />
            <TextField
              variant="outlined"
              label="Password"
              type="password"
              name="password"
              fullWidth
              margin="normal"
              onChange={this.onChange}
              value={this.state.usuario.password}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              style={style.submit}
              onClick={this.login}
            >
              Enviar
            </Button>

            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" onClick={this.resetearPass}>
                  {"Olvido su contraseña?"}
                </Link>
              </Grid>
              <Grid item xs>
                <Link href="/user/registarUsuario" variant="body2">
                  {"No tienes cuenta? Registrate"}
                </Link>
              </Grid>
            </Grid>
          </form>
          <Button
            fullWidth
            color="primary"
            variant="contained"
            style={style.submit}
            href="/user/loginTelefono"
          >
            Ingrese con su Telefono
          </Button>
        </div>
      </Container>
    );
  }
}

export default compose(consumerFirebase)(Login);
