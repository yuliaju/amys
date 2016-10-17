// @flow
/* global google */
import React from 'react';
import ReactDOM from 'react-dom';
import Map, {GoogleApiWrapper} from 'google-maps-react'
import TextResultList from './TextResultList'
import MapResultList from './MapResultList'

export default class Results extends React.Component {
  render() {
    return (
      <div>
        <Map google={window.google}
          style={{width: '100%', height: '50%', position: 'relative'}}
          zoom={14}>
        </Map>
        
        <TextResultList
          style={{width: '100%', height: '50%', position: 'relative', overflow: 'scroll'}}
          textResults={this.props.textResults} />
      </div>
    )
  }
};
