import React from "react";
import { List, ListItem, ListItemText, Divider } from "@material-ui/core";
import { Link } from "react-router-dom";

export const MenuIzquierda = ({ classes }) => (
  <div className={classes.list}>
    <List>
      <ListItem component={Link} button to="/user/perfil">
        <i className="material-icons">account_box</i>
        <ListItemText
          classes={{ primary: classes.listItemText }}
          primary=" Perfil"
        />
      </ListItem>
    </List>
    <Divider />
    <List>
      <ListItem component={Link} button to="/objeto/nuevoObjeto">
        <i className="material-icons">add_box</i>
        <ListItemText
          classes={{ primary: classes.listItemText }}
          primary=" Nuevo Objeto"
        />
      </ListItem>
      <ListItem component={Link} button to="">
        <i className="material-icons">extension</i>
        <ListItemText
          classes={{ primary: classes.listItemText }}
          primary=" Objetos"
        />
      </ListItem>
      <ListItem component={Link} button to="">
        <i className="material-icons">mail_outline</i>
        <ListItemText
          classes={{ primary: classes.listItemText }}
          primary=" Mensajes"
        />
      </ListItem>
    </List>
  </div>
);
