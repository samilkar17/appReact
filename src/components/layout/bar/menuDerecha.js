import React from "react";
import { List, Link, Avatar, ListItem, ListItemText } from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToAppSharp";
import ListItemIcon from "@material-ui/core/ListItemIcon";

export const MenuDerecha = ({
  classes,
  usuario,
  textoUsuario,
  fotoUsuario,
  cerrarSesion,
}) => (
  <div className={classes.list}>
    <List>
      <ListItem button component={Link} to="/user/resgistrarUsuario">
        <Avatar src={fotoUsuario} />
        <ListItemText
          classes={{ primary: classes.listItemText }}
          primary={textoUsuario}
        />
      </ListItem>
      <ListItem button onClick={cerrarSesion}>
        <ListItemIcon>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText
          classes={{ primary: classes.listItemText }}
          primary="Salir"
        />
      </ListItem>
    </List>
  </div>
);
