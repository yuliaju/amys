// @flow
import React from 'react';
import ReactDOM from 'react-dom';

export default class MapResultList extends React.Component {
    constructor(props: any) {
      super(props);
    }

    render() {
      return (
        <ul>
          {this.props.mapResults.map(this.renderMapResult)}
        </ul>
      )
    }

    //{name: string, address: string}
    renderMapResult(mapResult: Object) {
        return (
          <li>
            {mapResult.name}
            <br />
            {mapResult.address}
          </li>
        )
    }
}
