// @flow
/* global google */
import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-button';

export default class TermInput extends React.Component {
    constructor(props: any) {
      super(props);
    }

    // want it to have the term box,
    // and a button to remove each box
    render() {
      return(
        <div>
          <input key={this.props.index} onChange={(event) => this.props.onText(event)} />
          <Button
            onClick={() => this.props.remove(this.props.index)}
            label="Remove" />
        </div>
      )
    }


    //later - add autocomplete functionality
}
