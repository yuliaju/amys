// @flow
/* global google */
import React from 'react';
import ReactDOM from 'react-dom';
import Map, {GoogleApiWrapper} from 'google-maps-react'
import TextResultList from './TextResultList'
import MapResultList from './MapResultList'

export default class Results extends React.Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div>
        <Map google={window.google}
          style={{width: '100%', height: '400px'}}
          zoom={14}>
        </Map>

        <div style={{width: '100%', height: '400px', overflow: 'scroll'}}>
          {this.props.textResults.map((termResultPair) => {
            const term = Object.keys(termResultPair)[0];

            return (
              <div>
                <div>{term}</div>
                <TextResultList
                  textResults={termResultPair[term]} />
              </div>
            )
          })}
        </div>

      </div>
    )
  }
};
