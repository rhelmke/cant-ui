import React, { Component } from 'react';
import { SearchableNavigatableTable } from './Table';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export class SPN extends Component {
    constructor() {
        super();
        this.state = {spn: []}
    }

    componentDidMount() {
        window.active = this;
        fetch("/api/spn")
            .then( (response) => {
                return response.json() })   
                    .then( (json) => {
                            this.setState({spn: json});
                window.notifications.add("API", "Fetched SPN Database from backend.", true);
              })
              .catch( () => {
                window.notifications.add("API", "An error occured while fetching the SPN database from our backend.", false);
              });
    }

  componentWillUnmount() {
    window.active = null;
  };

    openDetails(id) {
        window.location = "/#/spn/" + id;
    }

  getHelp() {
    let msg = (
      <p>This is the SPN panel. You can browse and search all known SPNs provided by ISO 11783-1. 
      This database is read-only and has been fetched from the publicly available <a target="_blank" rel="noopener noreferrer" href="https://www.isobus.net/isobus/">ISO 11783-1 SPN online database</a> provided by <a target="_blank" rel="noopener noreferrer" href="https://lt.vdma.org/">VDMA Fachverband Landtechnik</a>.</p>
    );
    return msg;
  }

    render() {
        let data = [];
        for (var i = 0; i < this.state.spn.length; i++) {
            data.push({
                data: [this.state.spn[i].id, this.state.spn[i].name],
                onClickRow: this.openDetails,
                paramsOnClick: this.state.spn[i].id
            });
        };
        let targets = [
            {name: "ID", field: 0, apply: "toString", apply_arg: ""},
            {name: "Name", field: 1, apply: "", apply_arg: ""},
        ];
        return (
            <div id="spn-panel">
                <SearchableNavigatableTable targets={targets} header={["ID", "Name"]} data={data} />
            </div>
        )
    }
}

export class SPNDetails extends Component {

    constructor() {
        super();
        this.state = {
            spn: {id: 0, name: "", pgn: 0}
        }
    }

    componentDidMount() {
        fetch("http://localhost:8889/api/spn/" + this.props.match.params.spn_id)
            .then( (response) => {
                return response.json() })   
                    .then( (json) => {
                        this.setState({spn: json});
                    });
    }

    closeDetails() {
        window.location = "/#/spn";
    }

    render() {
        let pgn_url = "/#/pgn/" + this.state.spn.pgn;
        let attributes = [
            {name: "ID", value: this.state.spn.id.toString()},
            {name: "Name", value: this.state.spn.name},
            {name: "Associated pgn", value: <a target="_blank" rel="noopener noreferrer" href={pgn_url}>{this.state.spn.pgn}</a>},
        ];
        return (
            <Modal className="modal-overlay" show={true} onHide={this.closeDetails}>
              <Modal.Header>
                <Modal.Title><strong>SPN {this.state.spn.id}</strong></Modal.Title>
              </Modal.Header>
              <Modal.Body>
            <Table size="sm" striped bordered hover>
                <thead>
                    <tr>
                        <th style={{width: "10%"}} scope="col">Attribute</th>
                        <th scope="col">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {attributes.map( attr => {
                        return (
                            <tr>
                                <th style={{width: "10%"}} classGroup="col-md-1" scope="row"><div className="clickable">{attr.name}</div></th>
                                <td classGroup="col-md-2"><div className="clickable">{attr.value}</div></td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="outline-success" onClick={this.closeDetails}>Close</Button>
              </Modal.Footer>
            </Modal>
        )
    }
}
