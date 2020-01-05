import React from 'react';
import Container from 'react-bootstrap/Container';
import {
  HashRouter as Router,
  Route,
} from "react-router-dom";

import { Navigation } from './Navigation';
import { Notifications } from './Notifications';
import { PGN, PGNDetails } from './PGN'
import { SPN, SPNDetails } from './SPN'
import { Statistics } from './Statistics'

import './App.css';
const App = () => (
  <Router>
    <div id="page-content-wrapper">
      <Navigation />
      <Container id="content" fluid>
        <Notifications ref={(notifications) => {window.notifications = notifications}} />
        <Route path="/pgn" component={PGN} />
        <Route path="/pgn/:pgn_id" component={PGNDetails} />
        <Route path="/spn" component={SPN} />
        <Route path="/spn/:spn_id" component={SPNDetails} />
        <Route path="/statistics" component={Statistics} />
        <hr />
        <div id="footer">
          Made with ♥ by René Helmke © 2020<br />
          Powered by Twitter Bootstrap and Golang
        </div>
      </Container>
    </div>
  </Router>
);


export default App;
