// @flow
import React from 'react';
import ReactDOM from 'react-dom';

export default class TextResultList extends React.Component {
    constructor(props: any) {
      super(props);
    }

    render() {
      return (
        <ul>
          {this.props.textResults.map(textResult => this.renderTextResult(textResult))}
        </ul>
      )
    }

    renderTextResult(textResult: Object) {
        return (
          <li>
            {textResult.name}
            <br />
            {textResult.address}
          </li>
        )
    }
}
