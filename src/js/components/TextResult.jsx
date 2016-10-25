// @flow
import React from 'react';
import ReactDOM from 'react-dom';

export default class TextResult extends React.Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <article className="mw5 mw6-ns br3 hidden ba b--black-10 mv4">
        <h1 className="f4 bg-near-white br3 br--top black-60 mv0 pv2 ph3">{this.props.result.name}</h1>
        <div className="pa3 bt b--black-10">
          <p className="f6 f5-ns lh-copy measure">
            {this.props.result.location.address1}
          </p>
        </div>
      </article>
    )
  }
}
