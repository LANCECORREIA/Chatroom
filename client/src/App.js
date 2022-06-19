import "./App.css";
import React from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import {
  CssBaseline,
  Typography,
  TextField,
  Grid,
  Link,
  Paper,
  Card,
  CardHeader,
  Avatar,
} from "@material-ui/core";
import useStyles from "./styles";

const App = () => {
  const [client, setClient] = React.useState(null);
  const [state, setState] = React.useState({
    isLoggedIn: false,
    messages: [],
    value: "",
    name: "",
    room: "vacad",
  });
  const classes = useStyles();
  React.useEffect(() => {
    const client = new W3CWebSocket(
      "ws://127.0.0.1:8001/ws/chat/" + state.room + "/"
    );
    setClient(client);
    client.onopen = () => {
      console.log("connected");
    };
    client.onmessage = (e) => {
      console.log(e.data);
      // setMessages([...messages, e.data]);
    };
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      {state.isLoggedIn ? (
        <div style={{ marginTop: 50 }}>
          Room Name: {state.room}
          <Paper
            style={{
              height: 500,
              maxHeight: 500,
              overflow: "auto",
              boxShadow: "none",
            }}
          >
            {state.messages.map((message, index) => (
              <Card>
                <CardHeader
                  avatar={<Avatar className={classes.avatar}>R</Avatar>}
                  title={message.name}
                  subheader={message.time}
                />
                <Typography variant="body2" color="textSecondary" component="p">
                  {message.message}
                </Typography>
              </Card>
            ))}
          </Paper>
        </div>
      ) : (
        <>
          <CssBaseline />
          <div className={classes.paper}>
            <Typography>ChattyRooms</Typography>
            <form
              className={classes.form}
              noValidate
              onSubmit={(value) => setState({ ...state, isLoggedIn: true })}
            >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="Chatroom Name"
                label="Chatroom Name"
                name="Chatroom Name"
                type="text"
                value={state.room}
                // InputLabelProps={{
                //   shrink: true,
                // }}
                onChange={(e) => {
                  setState({ ...state, room: e.target.value });
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="Username"
                label="Username"
                type="text"
                id="Username"
                value={state.name}
                // InputLabelProps={{
                //   shrink: true,
                // }}
                onChange={(e) => {
                  setState({ ...state, name: e.target.value });
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Start Chatting
              </Button>
              <Grid container>
                <Grid item xs={12}>
                  <Link href="#" variant="body2">
                    Forgot Password?
                  </Link>
                </Grid>
                <Grid item xs={12}>
                  <Link href="#" variant="body2">
                    Dont have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </>
      )}
    </Container>
  );
};

export default App;
