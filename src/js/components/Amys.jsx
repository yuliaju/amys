// @flow
/* global google */
import React from 'react';
import ReactDOM from 'react-dom';
import TextResult from './TextResult'
import TextResultList from './TextResultList'
import MapResult from './MapResult'
import MapResultList from './MapResultList'
import Geosuggest from 'react-geosuggest';
import Button from 'react-button';
import Dropdown from 'react-dropdown';

export default class Amys extends React.Component {
  state: {
    openNow: boolean;
    location: string;
    term: string;
    // terms: Array<string>;
    // radius in meters
    radius: number;
  }

  constructor(props: any) {
    super(props);

    this.state = {
      openNow   : false,
      location  : "",
      term      : "",
      // terms     : [],
      radius    : 161
    };
  }

  render() {
    const options = [
      { label: '2 blocks', value: 161 },
      { label: '6 blocks', value: 483 },
      { label: '1 mile', value: 1609 },
    ];
    const defaultDropDownOption = options[0];

    return (
      <div>
        <Geosuggest
          placeholder="Start typing!"
          initialValue="New York City"
          onSuggestSelect={(sug) => this.onSuggestSelect(sug)}
          location={new google.maps.LatLng(40.730610, -73.935242)}
          radius="20" />
        <input
          type="text"
          value={this.state.term}
          onChange={(event) => this.onChangeTerm(event)} />
        <br />
        <input
          type="checkbox"
          checked={this.state.openNow}
          onChange={() => this.onChangeOpenNow()} />
        <br />
        <Dropdown
          options={options}
          onChange={(event) => this.onSelectRadius(event)}
          value={defaultDropDownOption}
          placeholder="Select an option" />
        <br />
        <Button
          onClick={(event) => this.onClick(event)}
          label="Search" />
      </div>
    )
  }

  onClick(event: any): void {
    this.getSearchUrls();
  }

  onChangeTerm(event: any): void {
    this.setState({term: event.target.value});
  }

  onChangeOpenNow(): void {
    this.setState({openNow: !this.state.openNow});
  }

  onSelectRadius(event: any): void {
    this.setState({radius: event.value});
  }

  onSuggestSelect(suggest: Object): void {
    this.setState({location: suggest.label});
  }

  serialize(obj: Object): string {
    var str = [];
    for(var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

  getSearchUrls(): void {
    // let params = Object.assign({}, this.state);
    // delete params.terms;
    //
    // for (let term in this.state.terms) {


      let path: string = this.serialize(this.state);
      let url: string = 'http://localhost:5000/business_search/?' + path;

      this.searchYelp(url);
    // }
  }

  searchYelp(url: string): void {
    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
      }).catch((error) => {
        console.error(error);
      });
  }
};

ReactDOM.render(<Amys />, document.getElementById('app'));
