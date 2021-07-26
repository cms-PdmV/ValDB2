import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { List, ListItem, ListItemSecondaryAction, ListItemText, Paper } from "@material-ui/core";
import { ReactElement } from "react";
import { useHistory } from "react-router";
import { Container } from "../components/Container";

export function AdminPage(): ReactElement {
  const history = useHistory()
  return (
    <Container>
      <h1>Administrator</h1>
      <Paper>
        <List component="nav" aria-label="secondary mailbox folders">
          <ListItem onClick={() => history.push('/admin/users')} button>
            <ListItemText primary="User Management" />
            <ListItemSecondaryAction><FontAwesomeIcon icon={faChevronRight}/></ListItemSecondaryAction>
          </ListItem>
          <ListItem onClick={() => history.push('/admin/usergroups')} button>
            <ListItemText primary="User Permission Group Management" />
            <ListItemSecondaryAction><FontAwesomeIcon icon={faChevronRight}/></ListItemSecondaryAction>
          </ListItem>
          <ListItem button>
            <ListItemText primary="Campaign Category/Permission Group" />
            <ListItemSecondaryAction><FontAwesomeIcon icon={faChevronRight}/></ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </Container>
  )
}