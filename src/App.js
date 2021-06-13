import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";
import "./App.css";
import Register from "./views/Register";
import Login from "./views/Login";
import Home from "./views/Home";
import Navbar from "./components/Navbar";
import SinglePost from "./views/SinglePost";
import UserPosts from "./views/UserPosts";
import { AuthProvider } from "./context/auth";
import AuthRoute from "./utils/authRoutes";

function App() {
  return (
    <AuthProvider>
      <Container>
        <Router>
          <Navbar></Navbar>
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/register" component={Register} />
          <AuthRoute exact path="/login" component={Login} />
          <Route exact path="/posts/:postId" component={SinglePost} />
          <Route exact path="/user/:username" component={UserPosts} />
        </Router>
      </Container>
    </AuthProvider>
  );
}

export default App;
