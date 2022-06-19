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

  const onButtonClicked = (e) => {
    e.preventDefault();
    client.send(
      JSON.stringify({
        name: state.name,
        room: state.room,
        message: state.value,
      })
    );
    setState({ ...state, value: "" });
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    setState({ ...state, isLoggedIn: true });
    setClient(
      new W3CWebSocket("ws://127.0.0.1:8001/ws/chat/" + state.room + "/")
    );
  };

  React.useEffect(() => {
    if (client) {
      client.onopen = () => {
        console.log("connected");
      };
      client.onmessage = (e) => {
        console.log(e.data);
        const data = JSON.parse(e.data);
        if (data) {
          setState((s) => ({
            ...s,
            messages: [
              ...s.messages,
              {
                msg: data.message,
                name: data.name,
              },
            ],
          }));
        }
      };
    }
  }, [client]);

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
                  avatar={
                    <Avatar className={classes.avatar}>
                      {message.name[0]}
                    </Avatar>
                  }
                  title={message.name}
                  subheader={message.msg}
                  // {message.time}
                />
              </Card>
            ))}
          </Paper>
          <form className={classes.form} noValidate onSubmit={onButtonClicked}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              autoFocus
              id="outlined-helperText"
              label="Message"
              value={state.value}
              onChange={(e) => {
                setState({
                  ...state,
                  value: e.target.value,
                });
              }}
            />
          </form>
        </div>
      ) : (
        <>
          <CssBaseline />
          <div className={classes.paper}>
            <Typography>ChattyRooms</Typography>
            <form className={classes.form} Validate onSubmit={onFormSubmit}>
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
                autoFocus
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
