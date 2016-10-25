// @flow
/* global google */
import React from 'react';
import ReactDOM from 'react-dom';
import Map, {GoogleApiWrapper, Marker} from 'google-maps-react'
import TextResultList from './TextResultList'
import MapResultList from './MapResultList'
import {intersect, intersect2} from '../utils/utils.js'
import Switch from 'react-toggle-switch'
import * as _ from 'lodash'

export default class Results extends React.Component {
  // START Flow type definitions
  state: {
    showIntersection  : boolean;
    mapCenter         : Object;
    mapZoom           : number;
  }
  // END Flow type definitions

  constructor(props: any) {
    super(props);

    this.state = {
      showIntersection  : true,
      mapCenter         : {lat: 37.792, lng: -122.398},
      mapZoom           : 14,
    }
  }

  render() {
    const intersectionResults = this.getIntersection(this.props.textResults);

    return (
      <div>
        <div style={{position: 'static'}}>
          <Map google={window.google}
            style={{width: '100%', height: '350px', zIndex: 999}}
            initialCenter={this.state.mapCenter}
            center={this.state.mapCenter}
            zoom={this.state.mapZoom}
            onClick={(mapProps, map, clickEvent) => this.mapClicked(mapProps, map, clickEvent, this.props.onMapInput)}>
            {this.props.textResults.map((termResultPair) => {
              const term = Object.keys(termResultPair)[0];

              return termResultPair[term].map((business) => {
                return(
                  <Marker
                    name={business.name}
                    position={{lat: business.coordinates.latitude, lng: business.coordinates.longitude}} />
                )
              })
            })}
          </Map>
        </div>

        {/* Hacky fix to the CSS problem with the Map component */}
        <div style={{height: '350px'}}></div>

        <div>
          <span>Display Intersection?</span>
          <Switch
            onClick={() => this.onToggleSwitch()}
            on={this.state.showIntersection} />
        </div>

        <div style={{width: '100%', height: '400px', overflow: 'scroll', position: 'static'}}>
          {(this.state.showIntersection && (intersectionResults.length > 0)) ?
            ( <div>
                <h3 style={{textTransform: 'uppercase'}}>Intersection ({intersectionResults.length})</h3>
                <TextResultList
                  textResults={intersectionResults} />
              </div> )
          : null}
          {this.props.textResults.map((termResultPair) => {
            const term = Object.keys(termResultPair)[0];

            return (
              <div>
                <h3 style={{textTransform: 'uppercase'}}>{term} ({termResultPair[term].length})</h3>
                <TextResultList
                  textResults={termResultPair[term]} />
              </div>
            )
          })}
        </div>

      </div>
    )
  }

  mapClicked(mapProps: any, map: any, clickEvent: any, callback: Function): void {
    let lat: number = clickEvent.latLng.lat();
    let lng: number = clickEvent.latLng.lng();

    // put the latitude and longitude into the input
    callback(lat, lng);
  }

  getIntersection(lists: Array<Object>): Array<any> {
    let intersection: Array<any> = lists.length <= 1 ? [] :
      intersect.apply(this,
        lists.map((obj) => {
          let term = Object.keys(obj)[0];
          return obj[term];
      }));

    return intersection;
  }

  onToggleSwitch(): void {
    this.setState({showIntersection: !this.state.showIntersection});
  }

  componentWillReceiveProps(nextProps: Object): void {
    if (!_.isEqual(this.state.mapCenter, nextProps.center)) {
      this.setState({mapCenter: nextProps.center});
    }
  }
};
