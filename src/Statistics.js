import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';

export class Statistics extends Component {
    constructor() {
        super();
        this.state = {
            stats: null,
            log: []
        }
    }

    componentDidMount() {
        window.active = this;
        this.statws = new WebSocket("ws://" + window.location.host + "/api/stats")
        this.statws.onmessage = function (e) {
            let data = JSON.parse(e.data)
            this.setState({stats: data})
        }.bind(this);
        this.logws = new WebSocket("ws://" + window.location.host + "/api/livelog")
        this.logws.onmessage = function (e) {
            let log = this.state.log
            if(log.length > 50) {
                log.shift()
            }
            log.push(JSON.parse(e.data))
            this.setState({log: log})
        }.bind(this);
        window.notifications.add("API", "Established websocket connection to backend.", true);
    }

    componentWillUnmount() {
        window.notifications.add("API", "Disconnection websocket", true);
        window.active = null;
        this.statws.close();
        this.logws.close();
    }

  getHelp() {
    let msg = (
        <p>This is the Statistics page. You can view statistics regarding the CAN connection.</p>
    );
    return msg;
  }

    render() {
        if(this.state.stats == null) {
            return (
                <div id="statistics">
                </div>
            )
        }

        return (
            <div id="statistics">
                <h1>Summary</h1>
                <Table size="sm" striped bordered hover>
                    <thead>
                        <tr>
                            <th scope="col">Identified Frames</th>
                            <th scope="col">Unknown Frames</th>
                            <th scope="col">Blocked Frames</th>
                            <th scope="col">Manipulated Frames</th>
                            <th scope="col">TX Frames</th>
                            <th scope="col">TX Bytes</th>
                            <th scope="col">RX Frames</th>
                            <th scope="col">RX Bytes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{this.state.stats.identified}</td>
                            <td>{this.state.stats.unknown}</td>
                            <td>{this.state.stats.blocked}</td>
                            <td>{this.state.stats.manipulated}</td>
                            <td>{this.state.stats.sum_tx}</td>
                            <td>{this.state.stats.sum_tx * 16}</td>
                            <td>{this.state.stats.sum_rx}</td>
                            <td>{this.state.stats.sum_rx * 16}</td>
                        </tr>
                    </tbody>
                </Table>
                <h1>Interfaces</h1>
                <Table size="sm" striped bordered hover>
                    <thead>
                        <tr>
                            <th scope="col">Interface</th>
                            <th scope="col">TX Frames</th>
                            <th scope="col">TX Bytes</th>
                            <th scope="col">RX Frames</th>
                            <th scope="col">RX Bytes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(this.state.stats.interfaces).map(iface => {
                            return (
                                <tr>
                                    <td>{iface}</td>
                                    <td>{this.state.stats.interfaces[iface].out_pkts}</td>
                                    <td>{this.state.stats.interfaces[iface].out_pkts * 16}</td>
                                    <td>{this.state.stats.interfaces[iface].in_pkts}</td>
                                    <td>{this.state.stats.interfaces[iface].in_pkts * 16}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                <h1>Live Log</h1>
                <pre className="pre-scrollable">
                    <code>
                        {this.state.log.map( line => {
                            return (
                                <p>{line.timestamp + " - " + line.identifier + " - " + line.msg}</p>
                            )
                        })}
                    </code>
                </pre>
            </div>
        )
    }
}
