// @flow
/* global google */
import React from 'react';
import ReactDOM from 'react-dom';
import TextResultList from './TextResultList'
import MapResultList from './MapResultList'
import Geosuggest from 'react-geosuggest';
import Button from 'react-button';
import Dropdown from 'react-dropdown';
import Map, {GoogleApiWrapper} from 'google-maps-react'
import {append, curry} from 'ramda'
import {serialize} from '../utils/utils.js'

export class Amys extends React.Component {
  state: {
    sharedQueryParams : Object;
    terms             : Array<string>;
    textResults       : Array<any>;
    inputs            : Array<any>;
    termInputs        : Object;
  }

  constructor(props: any) {
    super(props);

    this.state = {
      sharedQueryParams : {
        openNow   : false,
        location  : "",
        // term      : "",
        radius    : 161
      },
      terms       : [],
      textResults : [],
      inputs      : [],
      termInputs  : {}
    };

    // this.onText = this.onText.bind(this);
  }

  render() {
    const inputs = this.state.inputs.filter(input => input !== null).map((input, index) => {
      const fn = curry(this.onText)(index);

      return (<input type={input.text} key={index} onChange={fn} />);
    });

    const distances = [
      { label: '2 blocks', value: 161 },
      { label: '6 blocks', value: 483 },
      { label: '1 mile', value: 1609 },
    ];
    const defaultDistance = distances[0];

    return (
      <div>
        {/* Parameter inputs for query */}
        <Geosuggest
          placeholder="Start typing!"
          initialValue="New York City"
          onSuggestSelect={(sug) => this.onSuggestSelect(sug)}
          location={new google.maps.LatLng(40.730610, -73.935242)}
          radius="20" />

        {/* Dynamic term inputs  */}
        {inputs}
        <Button
          onClick={() => this.onAdd()}
          label="Add" />
        <br />

        <input
          type="checkbox"
          checked={this.state.sharedQueryParams.openNow}
          onChange={() => this.onChangeOpenNow()} />
        <br />
        <Dropdown
          options={distances}
          onChange={(event) => this.onSelectRadius(event)}
          value={defaultDistance}
          placeholder="Select an option" />
        <br />

        {/* Search button */}
        <Button
          onClick={(event) => this.onSubmit(event)}
          label="Search" />
        <br />

        {/* Results display */}
        <TextResultList
          textResults={this.state.textResults} />
      </div>
    )
  }

  onText(index: number, event: any): void {
    const newTermInputs = this.state.termInputs;
    newTermInputs[index] = event.target.value;

    // console.log(this.state.termInputs)

    this.setState({termInputs: newTermInputs});
  }

  onAdd(): void {
    const oldInputs = this.state.inputs;
    const newInputs = append({type: 'text'}, oldInputs); // , class: 'ma4'

    this.setState({inputs: newInputs});
  }

  onSubmit(event: any): void {
    this.getSearchUrls();
  }

  onChangeTerm(event: any): void {
    let newQueryParams = this.state.sharedQueryParams;
    newQueryParams.term = event.target.value;

    this.setState({sharedQueryParams: newQueryParams});
  }

  onChangeOpenNow(): void {
    let newQueryParams = this.state.sharedQueryParams;
    newQueryParams.openNow = !newQueryParams.openNow;

    this.setState({sharedQueryParams: newQueryParams});
  }

  onSelectRadius(event: any): void {
    let newQueryParams = this.state.sharedQueryParams;
    newQueryParams.radius = event.value;

    this.setState({sharedQueryParams: newQueryParams});
  }

  onSuggestSelect(suggest: Object): void {
    let newQueryParams = this.state.sharedQueryParams;
    newQueryParams.location = suggest.label;

    this.setState({sharedQueryParams: newQueryParams});
  }

  getSearchUrls(): void {
    // let params = Object.assign({}, this.state);
    // delete params.terms;
    //
    // for (let term in this.state.terms) {


      let path: string = serialize(this.state.sharedQueryParams);
      let url: string = 'http://localhost:5000/business_search/?' + path;

      this.searchYelp(url);
    // }
  }

  searchYelp(url: string): void {
    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);

        // display results
        this.setState({textResults: response.businesses});
      }).catch((error) => {
        console.error(error);
      });
  }
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyD-t_6mqKXkBUGJfQVs_xRlZ1cXWGtm9zQ"
})(Amys)

ReactDOM.render(<Amys />, document.getElementById('app'));
