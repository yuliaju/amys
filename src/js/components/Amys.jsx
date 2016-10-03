// @flow
/* global google */
import React from 'react';
import ReactDOM from 'react-dom';
import TextResult from './TextResult'
import MapResult from './MapResult'
import Geosuggest from 'react-geosuggest';

export default class Amys extends React.Component {
  render() {
    return (
      <div>
        <Geosuggest
          placeholder="Start typing!"
          initialValue="New York City"
          onSuggestSelect={(sug) => this.onSuggestSelect(sug)}
          location={new google.maps.LatLng(40.730610, -73.935242)}
          radius="20" />
      </div>
    )
  }

  onSuggestSelect(suggest: Object) {
    console.log(suggest);

    this.searchYelp(suggest.label);
  }

  searchYelp(location: string) {
    var path: string = location;
    var url: string = 'http://localhost:5000/search/' + path;

    fetch(url)
      .then((response) => {
        return response.text();
      }).then((text) => {
        // console.log(text);
        // make map result objects for all of the responses
        var jsons = JSON.parse(text);
        for (var json in jsons) {
          var business = jsons[json]

          ReactDOM.render(
            React.createElement(TextResult, {name: business.name, address: business.location.address[0]}),
            document.getElementById('info')
          );
        }
      }).catch((error) => {
        console.error(error);
      });
  }
};

ReactDOM.render(<Amys />, document.getElementById('app'));
