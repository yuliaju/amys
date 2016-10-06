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

export default class Amys extends React.Component {
  state: {
    openNow: boolean;
    location: string
  }

  constructor(props: any) {
    super(props);

    this.state = {
      openNow   : false,
      location  : ""
    };
  }

  render() {
    return (
      <div>
        <Geosuggest
          placeholder="Start typing!"
          initialValue="New York City"
          onSuggestSelect={(sug) => this.onSuggestSelect(sug)}
          location={new google.maps.LatLng(40.730610, -73.935242)}
          radius="20" />
        <input
          type="checkbox"
          checked={this.state.openNow}
          onChange={() => this.onChangeOpenNow()} />
        <br />
        <Button
          onClick={e => this.onClick(e)}
          label="Search" />
      </div>
    )
  }

  onClick(event: any) {
    console.log("button clicked");
    this.searchYelp(this.state.location);
  }

  onChangeOpenNow() {
    this.setState({openNow: !this.state.openNow});
  }

  onSuggestSelect(suggest: Object) {
    console.log(suggest);

    this.setState({location: suggest.label});
    // this.searchYelp(suggest.label);
  }

  searchYelp(location: string) {
    let path: string = location;
    let url: string = 'http://localhost:5000/search/' + path;

    fetch(url)
      .then((response) => {
        return response.text();
      }).then((text) => {
        let textResults: Array<any> = [];
        let jsons = JSON.parse(text);
        for (let json in jsons) {
          let business = jsons[json];

          textResults.push(
            {name: business.name, address: business.location.address[0]}
          );
        }

        ReactDOM.render(
          React.createElement(TextResultList, {textResults: textResults}),
          document.getElementById('textResults')
        );
      }).catch((error) => {
        console.error(error);
      });
  }
};

ReactDOM.render(<Amys />, document.getElementById('app'));
