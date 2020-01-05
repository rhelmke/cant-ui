import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import InputGroup from 'react-bootstrap/InputGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

export class SearchableNavigatableTable extends Component {
  constructor(props) {
    super(props);
    this.filters = [
      {name: "Contains", func: this.filterContains},
      {name: "Exact Match", func: this.filterExact},
      {name: "Has Prefix", func: this.filterPrefix},
      {name: "Has Suffix", func: this.filterSuffix}
    ];
    this.state = {
      filter: {term: "", filter_func: this.filters[0], target: props.targets[0]}
    };
  }

  filterContains(field, qry) {
    return field.indexOf(qry) !== -1;
  }

  filterExact(field, qry) {
    return field === qry;
  }

  filterPrefix(field, qry) {
    return field.startsWith(qry);
  }

  filterSuffix(field, qry) {
    return field.endsWith(qry);
  }

  resetFilter(event) {
    this.setState({filter: {term: "", filter_func: this.filters[0], target: this.props.targets[0]}});
  }

  updateSearch(event) {
    let updated = this.state.filter;
    updated.term = event.target.value;
    this.updateFilter.bind(this)(updated);
  }

  updateFilter(filter) {
    for(var prop in this.state.filter) {
      if(!filter.hasOwnProperty(prop) && this.state.filter.hasOwnProperty(prop)) {
        filter[prop] = this.state.filter[prop];
      }
    }
    this.setState({filter: filter});
  }

  filterData() {
    if (this.state.filter.target == null) {
      return this.props.data;
    }
    return this.props.data.filter(data => {
      let filter = this.state.filter;
      let field = data.data[filter.target.field];
      if(filter.target.apply !== "") {
        if(filter.target.apply_arg !== "")
          field = field[filter.target.apply](filter.target.apply_arg)
        else
          field = field[filter.target.apply]()
      }
      return filter.filter_func.func(field.toLowerCase(), filter.term.toLowerCase());
    });
  }

  render() {
    return (
      <div id="searchable_navigatable_table">
      <InputGroup>
        <DropdownButton size="sm" as={InputGroup.Prepend} variant="outline-primary" title={this.state.filter.target.name}>
          {this.props.targets.map( target => {return (<Dropdown.Item style={{fontSize:"smaller"}} onClick={this.updateFilter.bind(this, {target: target})}>{target.name}</Dropdown.Item>)})}
        </DropdownButton>
        <DropdownButton size="sm" as={InputGroup.Prepend} variant="outline-warning" title={this.state.filter.filter_func.name}>
          {this.filters.map(filter => {return (<Dropdown.Item style={{fontSize:"smaller"}} onClick={this.updateFilter.bind(this, {filter_func: filter})}>{filter.name}</Dropdown.Item>)})}
        </DropdownButton>
        <FormControl type="text" style={{fontSize:"13px"}} placeholder="Filter search..." value={this.state.filter.term} onChange={this.updateSearch.bind(this)} />
        <Button size="sm" variant="outline-danger" onClick={this.resetFilter.bind(this)}>Reset Filter</Button>
      </InputGroup>
      <hr/>
      <NavigatableTable header={this.props.header} data={this.filterData()}/>
      </div>
    )
  }
}


export class NavigatableTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: 1,
      page: 1
    };
  }

  changePage(event) {
    let page = parseInt(event.target.value);
    if(page >= 1 && page <= this.state.pages) {
      this.setState({page: page});
    } else {
      this.setState({page: 1});
    }
  }


  render() {
    this.state.pages = Math.ceil(this.props.data.length / 20);
    return (
      <div id="table_navigation" style={{paddingLeft: "25%", paddingRight: "25%"}}>
        <OwnTable header={this.props.header} data={this.props.data.slice(0 + (this.state.page - 1) * 20, 20 + (this.state.page - 1) * 20)}/>
        <ButtonToolbar>
          <ButtonGroup>
            <Button onClick={this.changePage.bind(this)} value={this.state.page - 1} size="sm" variant="outline-secondary">&lt;&lt;</Button>
            <Button onClick={this.changePage.bind(this)} value={this.state.page + 1} size="sm" variant="outline-secondary">&gt;&gt;</Button>
          </ButtonGroup>
        </ButtonToolbar>
          <p>
          {this.props.data.length} Results
          </p>
      </div>
    )
  }
}

export class OwnTable extends Component {
  render() {
    return (
      <div id="table">
        <Table striped bordered hover size="sm">
          <thead>
              <tr>
                  {this.props.header.map( header => {
                      return <th scope="col">{header}</th>
                  })}
              </tr>
          </thead>
          <tbody>
          {this.props.data.map( row => {
            let count = 0;
            if (row.onClickRow == null) {
              return (
                <tr>
                  {row.map( column => {
                    if (count++ === 0) {
                      return <th style={{width: "10%"}} scope="row" className="col-md-1"><div className="clickable">{column}</div></th>
                    };
                    return <td className="col-md-2"><div className="clickable long_text">{column}</div></td>
                  })}
                  </tr>   
              )
            } else {
              return (
                <tr onClick={row.onClickRow.bind(this, row.paramsOnClick)}>
                  {row.data.map( column => {
                    if (count++ === 0) {
                      return <th scope="row" className="col-md-1"><div className="clickable">{column}</div></th>
                    };
                    return <td className="col-md-2"><div className="clickable long_text">{column}</div></td>
                  })}
                </tr>   
              )}
            })}                    
          </tbody>
        </Table>
      </div>
    )
  }
}
