// @flow
import React from 'react';
import ReactDOM from 'react-dom';

export default class TextResult extends React.Component {
  render() {
    return (
      <div>
        {this.props.name}
      </div>
    )
  }
}

TextResult.propTypes = {
  name: React.PropTypes.string,
  address: React.PropTypes.string
  // location: React.PropTypes.object
}
