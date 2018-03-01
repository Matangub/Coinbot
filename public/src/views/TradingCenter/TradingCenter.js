import React from 'react';
import ReactDOM from 'react-dom';
import request from 'superagent'

import ChartComponent from './Candlestick_chart/index.js';

export default class TradingCenter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  fill(d) {
		return d.close > d.open ? "#4CAF50" : "#F44336";
	}

  render() {
    return (
      <div className="container-fluid grid_wrapper">
        <ChartComponent />
      </div>
    );
  }
}
