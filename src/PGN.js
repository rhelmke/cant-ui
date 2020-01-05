import React, { Component } from 'react';
import { SearchableNavigatableTable } from './Table';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export class PGN extends Component {
  constructor() {
    super();
    this.state = {pgn: []};
  }

  componentDidMount() {
    window.active = this;
    fetch("/api/pgn")
          .then( (response) => {
            return response.json() })   
              .then( (json) => {
                this.setState({pgn: json});
                window.notifications.add("API", "Fetched PGN Database from backend.", true);
              })
              .catch( () => {
                window.notifications.add("API", "An error occured while fetching the PGN database from our backend.", false);
              });
  }

  componentWillUnmount() {
    window.active = null;
  };

  getHelp() {
    let msg = (
      <p>This is the PGN panel. You can browse and search all known PGNs provided by ISO 11783-1. 
      This database is read-only and has been fetched from the publicly available <a target="_blank" rel="noopener noreferrer" href="http://www.isobus.net/isobus/">ISO 11783-1 PGN online database</a> provided by <a target="_blank" rel="noopener noreferrer" href="http://lt.vdma.org/">VDMA Fachverband Landtechnik</a>.</p>
    );
    return msg;
  }

  openDetails(id) {
    window.location = "/#/pgn/" + id;
  }

  render() {
   let data = [];
   for (var i = 0; i < this.state.pgn.length; i++) {
    data.push({
      data: [this.state.pgn[i].id, this.state.pgn[i].name],
      onClickRow: this.openDetails,
      paramsOnClick: this.state.pgn[i].id
    });
   };
   let targets = [
     {name: "ID", field: 0, apply: "toString", apply_arg: ""},
     {name: "Name", field: 1, apply: "", apply_arg: ""}
   ];
   return (
     <div id="pgn-panel">
       <SearchableNavigatableTable targets={targets} header={["ID", "Name"]} data={data} />
     </div>
   )
  }
}


export class PGNDetails extends React.Component {
    constructor() {
        super();
        this.state = {
            pgn: {id: 0, name: "", edp: 0, dp: 0, pf: 0, ps: "", multipacket: false, dlc: 0},
            spns: [],
            filters:[]
        }
    }

    componentDidMount() {
        fetch("/api/pgn/" + this.props.match.params.pgn_id)
            .then( (response) => {
                return response.json() })   
                    .then( (json) => {
                        fetch("/api/spnforpgn/" + json.id)
                            .then( (response2) => {
                                return response2.json()
                            }).then( (json2) => {
                                fetch("/api/filter/" + json.id)
                                    .then( (response3) => {
                                        return response3.json()
                                    }).then( (json3) => {
                                        this.setState({pgn: json, spns:json2, filters:json3});
                                    })
                            })
                    });
    }

    closeDetails() {
        window.location = "/#/pgn";
    }

    deleteFilter(event) {
        fetch('/api/filter/' + this.state.pgn.id + '/' + event.target.value, {method: "delete"})
            .then( success => {
        console.log("there")
                this.componentDidMount();
        });
    }

    addFilter(event) {
        fetch('/api/filter/' + this.state.pgn.id + '/' + event.target.value, {method: "POST"})
            .then( success => {
                this.componentDidMount();      
        });
    }

    render() {
        let attributes = [
            {name: "ID", value: this.state.pgn.id.toString()},
            {name: "Name", value: this.state.pgn.name},
            {name: "EDP", value: this.state.pgn.edp.toString()},
            {name: "DP", value: this.state.pgn.dp.toString()},
            {name: "PF", value: this.state.pgn.pf.toString()},
            {name: "PS", value: this.state.pgn.ps},
            {name: "Multipacket", value: this.state.pgn.multipacket.toString()},
            {name: "DLC", value: this.state.pgn.dlc.toString()},
        ];
        return (
            <Modal className="modal-overlay" show={true} onHide={this.closeDetails}>
              <Modal.Header>
                <Modal.Title><strong>PGN {this.state.pgn.id}</strong></Modal.Title>
              </Modal.Header>
              <Modal.Body>
            <Table size="sm" striped bordered hover>
                <thead>
                    <tr>
                        <th style={{width: "10%"}}scope="col">Attribute</th>
                        <th scope="col">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {attributes.map( attr => {
                        return (
                            <tr>
                                <th style={{width: "10%"}} className="col-md-1" scope="row">{attr.name}</th>
                                <td className="col-md-2">{attr.value}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <p>Associated with following SPNs</p>
            <Table size="sm" striped bordered hover>
                <thead>
                    <tr>
                        <th style={{width: "10%"}} scope="col">ID</th>
                        <th scope="col">Name</th>
                    </tr>
                </thead>
                <tbody>
                   {this.state.spns.map( attr => {
                        let url = "/#/spn/" + attr.id;
                        return (
                            <tr>
                                <th style={{width: "10%"}} className="col-md-1" scope="row"><div className="clickable"> {attr.id}</div></th>
                                <td className="col-md-2"><div className="clickable"><a target="_blank" rel="noopener noreferrer" href={url}>{attr.name}</a></div></td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <p>Filters</p>
              <ListGroup>
                {this.state.filters.map (filter => {
                    for(var i = 0; i < filter.for_pgns.length; i++) {
                        if(filter.for_pgns[i].pgn === this.state.pgn.id && filter.for_pgns[i].enabled) {
                            return (
                                <ListGroup.Item variant="success" value={filter.id} onClick={this.deleteFilter.bind(this)} action>{filter.name}</ListGroup.Item>
                            )
                        }
                    }
                    return (
                        <ListGroup.Item value={filter.id} onClick={this.addFilter.bind(this)} action>{filter.name}</ListGroup.Item>
                    )
                })}
              </ListGroup>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="outline-success" onClick={this.closeDetails}>Close</Button>
              </Modal.Footer>
            </Modal>
        )
    }
}
