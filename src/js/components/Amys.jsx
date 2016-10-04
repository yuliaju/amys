// @flow
/* global google */
import React from 'react';
import ReactDOM from 'react-dom';
import TextResult from './TextResult'
import TextResultList from './TextResultList'
import MapResult from './MapResult'
import MapResultList from './MapResultList'
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
        var textResults: Array<any> = [];
        var jsons = JSON.parse(text);
        for (var json in jsons) {
          var business = jsons[json];

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
