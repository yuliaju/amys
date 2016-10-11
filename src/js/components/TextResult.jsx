// @flow
import React from 'react';
import ReactDOM from 'react-dom';

export default class TextResult extends React.Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.result.name}
        <br />
        {this.props.result.location.address1}
      </div>
    )
  }
}
