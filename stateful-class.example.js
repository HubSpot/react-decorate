import { makeDecorator, StatefulDecorator } from 'react-decorate';

function splat(original, additions) {
  return Object.assign({}, original, additions);
}

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

export class Count extends StatefulDecorator {
  constructor(propName = 'count') {
    this._propName = propName;
    this._incName = `inc${capitalize(propName)}`;
  }

  nextProps(props) {
    const count = this.state;
    return splat(props, {
      [this._propName]: count,
      [this._incName]: () => this.setState(count + 1),
    });
  }
}

export default makeDecorator(Count);
