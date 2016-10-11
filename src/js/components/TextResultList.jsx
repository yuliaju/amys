// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import TextResult from './TextResult'

export default class TextResultList extends React.Component {
    constructor(props: any) {
      super(props);
    }

    render() {
      return (
        <ul>
          {this.props.textResults.map((textResult) => (
            <TextResult
              result={textResult} />
          ))}
        </ul>
      )
    }
}
