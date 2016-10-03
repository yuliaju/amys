// @flow
import React from 'react';
import ReactDOM from 'react-dom';

export default class MapResult extends React.Component {
  render() {
    return (
      <div>
        {this.props.name}: {this.props.address}
        <br />
        {this.props.rating} / 5
      </div>
    )
  }
}

MapResult.propTypes = {
  name: React.PropTypes.string,
  address: React.PropTypes.string,
  location: React.PropTypes.object,
  rating: React.PropTypes.number
}
