import "./App.css";
import React, { useState, useEffect, useRef } from "react";
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
  const [client, setClient] = useState(null);
  const [state, setState] = useState({
    isLoggedIn: false,
    messages: [],
    value: "",
    name: "",
    room: "vacad",
  });

  const scrollRef = useRef(null);

  const classes = useStyles();

  const onButtonClicked = (e) => {
    e.preventDefault();
    if (state.value.trim() === "") return;
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
      new W3CWebSocket(
        "wss://personalchat-app.herokuapp.com/ws/chat/" + state.room + "/"
      )
    );
  };

  useEffect(() => {
    if (client) {
      client.onopen = () => {
        console.log("WebSocket connected");
      };
      client.onmessage = (e) => {
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [state.messages]);

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
              <Card ref={scrollRef}>
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
            <form className={classes.form} onSubmit={onFormSubmit}>
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
            </form>
          </div>
        </>
      )}
    </Container>
  );
};

export default App;
