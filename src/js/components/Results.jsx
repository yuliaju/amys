// @flow
/* global google */
import React from 'react';
import ReactDOM from 'react-dom';
import Map, {GoogleApiWrapper} from 'google-maps-react'
import TextResultList from './TextResultList'
import MapResultList from './MapResultList'
import {intersect, intersect2} from '../utils/utils.js'
import Switch from 'react-toggle-switch'

export default class Results extends React.Component {
  // START Flow type definitions
  state: {
    showIntersection  : boolean;
  }

  // END Flow type definitions
  constructor(props: any) {
    super(props);

    this.state = {
      showIntersection  : true
    }
  }

  render() {
    const intersectionResults = this.getIntersection(this.props.textResults);

    return (
      <div>
        <div style={{position: 'static'}}>
          <Map google={window.google}
            style={{width: '100%', height: '350px', zIndex: 999}}
            zoom={14}>
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
          {(this.state.showIntersection && (typeof intersectionResults != 'undefined')) ? (
          <div>
            <h3 style={{textTransform: 'uppercase'}}>Intersection ({intersectionResults.length})</h3>
            <TextResultList
              textResults={intersectionResults} />
          </div>
          ) :
          null}
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

  getIntersection(lists: Array<Object>): Array<any> {
    let intersection = [];

    intersection = intersect.apply(this,
      lists.map((obj) => {
        let term = Object.keys(obj)[0];
        return obj[term];
    }));

    return intersection;
  }

  onToggleSwitch(): void {
    this.setState({showIntersection: !this.state.showIntersection});
  }
};
