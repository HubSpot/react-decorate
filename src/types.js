/* @flow */

export type Applicable = {
  getInitialState: ?() => any;
  componentWillMount: ?() => any;
  componentDidMount: ?() => any;
  componentWillReceiveProps: ?() => any;
  componentWillUnmount: ?() => void;
}