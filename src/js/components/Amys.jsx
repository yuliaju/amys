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

const distances = [
  { label: '2 blocks', value: 161 },
  { label: '6 blocks', value: 483 },
  { label: '1 mile', value: 1609 },
];

export class Amys extends React.Component {
  state: {
    sharedQueryParams : Object;
    textResults       : Array<any>;
    inputs            : Array<any>;
    termInputs        : Object;
    radiusLabel       : string;
  }

  constructor(props: any) {
    super(props);

    this.state = {
      sharedQueryParams : {
        openNow   : false,
        location  : "",
        radiusVal : distances[0].value
      },
      textResults : [],
      inputs      : [{type: 'text'}],
      termInputs  : {0: ""},
      radiusLabel : distances[0].label
    };

    this.onText = this.onText.bind(this);
  }

  render() {
    const inputs = this.state.inputs
                    .filter(input => input !== null)
                    .map((input, index) => {
                      const fn = curry(this.onText)(index);

                      return (<input type={input.text} key={index} onChange={fn} />);
                    });

    return (
      <div>
        {/* Location */}
        <Geosuggest
          placeholder="Start typing!"
          initialValue="New York City"
          onSuggestSelect={(sug) => this.onSuggestSelect(sug)}
          location={new google.maps.LatLng(40.730610, -73.935242)}
          radius="20" />

        {/* Dynamic term inputs  */}
        <Button
          onClick={() => this.onAddTermBox()}
          label="Add" />
        <Button
          onClick={() => this.onRemoveTermBox()}
          label="Remove" />
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

  onText(index: number, event: any): void {
    const newTermInputs = this.state.termInputs;
    newTermInputs[index] = event.target.value;

    console.log(this.state.termInputs)
    this.setState({termInputs: newTermInputs});
  }

  onAddTermBox(): void {
    const oldInputs = this.state.inputs;
    const newInputs = append({type: 'text'}, oldInputs); // , class: 'ma4'

    this.setState({inputs: newInputs});
  }

  onRemoveTermBox(): void {
    const newInputs = this.state.inputs;
    let index = newInputs.length - 1;
    newInputs.pop();
    const newTermInputs = this.state.termInputs;
    delete newTermInputs[index];

    this.setState({inputs: newInputs});
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
    console.log(event);

    this.setState({sharedQueryParams: newQueryParams});
    this.setState({radiusLabel: event.label});
  }

  onSuggestSelect(suggest: Object): void {
    let newQueryParams = this.state.sharedQueryParams;
    newQueryParams.location = suggest.label;

    this.setState({sharedQueryParams: newQueryParams});
  }

  getSearchUrls(): void {
    let path: string = serialize(this.state.sharedQueryParams);
    let baseUrl: string = 'http://localhost:5000/business_search/?' + path;

    for (var index in this.state.termInputs) {
      if (this.state.termInputs[index].length > 0) {
        let baseUrlWithTerm = baseUrl + serializeTerm(this.state.termInputs[index]);
        this.searchYelp(baseUrlWithTerm);
      }
    }
  }

  searchYelp(url: string): void {
    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        // console.log(response);

        // append results
        let newTextResults = this.state.textResults;
        let term = Object.keys(response)[0];
        newTextResults.push({[term]: response[term].businesses})

        this.setState({textResults: newTextResults});
      }).catch((error) => {
        console.error(error);
      });
  }

  renderChildren() {
    ReactDOM.render(
      <Results textResults={this.state.textResults} />,
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
