// @flow
/* global google */
import React from 'react';
import ReactDOM from 'react-dom';
import Results from './Results'
import TermInput from './TermInput'
import Geosuggest from 'react-geosuggest';
import Button from 'react-button';
import Dropdown from 'react-dropdown';
import {append, curry} from 'ramda'
import {serialize, serializeTerm} from '../utils/utils.js'
import * as _ from 'lodash'

const distances = [
  { label: '2 blocks', value: 161 },
  { label: '6 blocks', value: 483 },
  { label: '1 mile', value: 1609 },
  { label: '2 miles', value: 3219 },
  { label: '5 miles', value: 8047 },
];

export class Amys extends React.Component {
  // START Flow type definitions
  state: {
    sharedQueryParams : Object;
    textResults       : Array<any>;
    // inputs            : Array<any>;
    termInputs        : Array<string>;
    radiusLabel       : string;
    coordInUse        : boolean;
    locationCoord     : Object;
  }

  onText: (index: number, event: any) => void;
  onRemoveTermBox: (index: number) => void;
  onMapInput: (lat: number, lng: number) => void;
  // END Flow type definitions

  constructor(props: any) {
    super(props);

    this.state = {
      sharedQueryParams : {
        openNow   : false,
        location  : "",
        radius    : distances[0].value
      },
      textResults   : [],
      termInputs    : [""],
      radiusLabel   : distances[0].label,
      coordInUse    : false,
      locationCoord : {lat: 40.730610, lng: -73.935242},
    };

    this.onText = this.onText.bind(this);
    this.onRemoveTermBox = this.onRemoveTermBox.bind(this);
    this.onMapInput = this.onMapInput.bind(this);
  }

  render() {
    return (
      <div>
        {/* Location */}
        <Geosuggest
          placeholder="Enter an address!"
          initialValue={this.state.sharedQueryParams.location}
          onSuggestSelect={(sug) => this.onSuggestSelect(sug)}
          location={new google.maps.LatLng(40.730610, -73.935242)}
          radius="20" />
        {this.state.coordInUse ?
          ( <div>
              <span>Latitude: {this.state.sharedQueryParams.latitude.toFixed(3)}</span><br />
              <span>Longitude: {this.state.sharedQueryParams.longitude.toFixed(3)}</span>
            </div> )
          : null}

        {/* Dynamic term inputs  */}
        {this.state.termInputs
          .map((term, index) => {
            const onTextFn = curry(this.onText)(index);

            return (
              <TermInput index={index} onText={onTextFn} remove={this.onRemoveTermBox} />
            )
        })}
        <Button
          onClick={() => this.onAddTermBox()}
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
          value={this.state.radiusLabel} />

        {/* Search button */}
        <Button
          onClick={(event) => this.onSubmit(event)}
          label="Search" />
        <br />
      </div>
    )
  }

  onMapInput(lat: number, lng: number): void {
    let newQueryParams = this.state.sharedQueryParams;
    newQueryParams.latitude = lat;
    newQueryParams.longitude = lng;

    this.setState({sharedQueryParams: newQueryParams});
    this.setState({coordInUse: true});
    this.setState({locationCoord: {lat: lat, lng: lng}});
  }

  onText(index: number, event: any): void {
    const newTermInputs = this.state.termInputs;
    newTermInputs[index] = event.target.value;

    this.setState({termInputs: newTermInputs});
  }

  onAddTermBox(): void {
    const newTermInputs = this.state.termInputs;
    newTermInputs.push("");

    this.setState({termInputs: newTermInputs});
  }

  onRemoveTermBox(index: number): void {
    const newTermInputs = this.state.termInputs;
    newTermInputs.splice(index, 1);
    this.setState({termInputs: newTermInputs});
  }

  onSubmit(event: any): void {
    // reset current textResults
    this.setState({textResults: []});
    this.getSearchUrls();
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
    this.setState({radiusLabel: event.label});
  }

  onSuggestSelect(suggest: Object): void {
    let newQueryParams = this.state.sharedQueryParams;
    newQueryParams.location = suggest.label;

    this.setState({sharedQueryParams: newQueryParams});
    this.setState({coordInUse: false});
    this.setState({locationCoord: suggest.location});
  }

  getModifiedSharedQueryParams(): Object {
    if (this.state.coordInUse) {
      // remove location if latitude and longitude are specified
      return _.omit(this.state.sharedQueryParams, ['location']);
    } else {
      return _.omit(this.state.sharedQueryParams, ['latitude', 'longitude']);
    }
  }

  getSearchUrls(): void {
    let path: string = serialize(this.getModifiedSharedQueryParams());
    let baseUrl: string = 'http://localhost:5000/business_search/?' + path;

    this.state.termInputs.filter((term) => term.length > 0).map((term) => {
      let baseUrlWithTerm = baseUrl + serializeTerm(term);
      this.searchYelp(baseUrlWithTerm);
    });
  }

  searchYelp(url: string): void {
    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        // append results
        let newTextResults = this.state.textResults;
        let term = Object.keys(response)[0];
        newTextResults.push({[term]: response[term].businesses})

        this.setState({textResults: newTextResults});

        return this.state.textResults;
      }).catch((error) => {
        console.error(error);
      });
  }

  renderChildren() {
    ReactDOM.render(
      <Results
        textResults={this.state.textResults}
        onMapInput={this.onMapInput}
        center={this.state.locationCoord} />,
      document.getElementById('results')
    )
  }

  componentDidMount() {
    this.renderChildren();
  }

  componentDidUpdate() {
    this.renderChildren();
  }
};

ReactDOM.render(<Amys />, document.getElementById('search'));
