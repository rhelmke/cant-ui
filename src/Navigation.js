import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {
  Link
} from "react-router-dom";

export class Navigation extends Component {
  help() {
    let msg = "Select a Component in the Navigation Bar and I'll give you some useful information!"
    if(window.active) {
      msg = window.active.getHelp();
    }
    window.notifications.add('Help', msg, false)
  };
  render() {
    return (
      <Navbar collapseOnSelect bg="dark" variant="dark" className="justify-content-between">
        <Navbar.Brand href="#">
          CANT
        </Navbar.Brand>
        <Navbar.Collapse>
          <Nav>
            <NavItem name="PGN" />
            <NavItem name="SPN" />
            <NavItem name="Statistics" /> 
          </Nav>
        </Navbar.Collapse>
        <Form inline>
          <Button variant="outline-success" onClick={this.help}>Help</Button>
        </Form>
      </Navbar>
    )
  };
};

export class NavItem extends Component {
  render() {
    return (
      <li className="nav-item">
          <Link to={this.props.name.toLowerCase()} className="nav-link">
              {this.props.name}
          </Link>
      </li>
    )
  };
};
