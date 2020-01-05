import React, { Component } from 'react';
import Toast from 'react-bootstrap/Toast';

export class Notifications extends Component {
  constructor() {
    super();
    this.state = {toasts: {}};
    this.count = 0;
  };


  add(type, message, auto) {
    // <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
    let toasts = Object.assign({}, this.state.toasts);
    toasts[this.count] = <Notification identifier={this.count} key={this.count} remove={this.remove.bind(this)} type={type} message={message} auto={auto} />
    this.count++;
    this.setState({toasts: toasts})
  };

  remove(key) {
    let toasts = Object.assign({}, this.state.toasts);
    delete toasts[key];
    this.setState({toasts: toasts});
  };

  render() {
    return (
      <div id="notifications" aria-live="polite" aria-atomic="true">
        {Object.keys(this.state.toasts).map(function(key) {
          return (
            this.state.toasts[key]
          )
        }, this)}
      </div>
    );
  };
};

export class Notification extends Component {
  render() {
    return (
      <Toast onClose={() => this.props.remove(this.props.identifier)} autohide={this.props.auto}>
        <Toast.Header>
          <strong className="mr-auto">{this.props.type}</strong>
          <small>Notification</small>
        </Toast.Header>
        <Toast.Body>{this.props.message}</Toast.Body>
      </Toast>
    );
  };
};

