import React from 'react';
import { render } from 'react-dom';
import Chart from './Chart';
import { getData, getBitcoinHistory } from "./utils"

import { TypeChooser } from "react-stockcharts/lib/helper";


export default class ChartComponent extends React.Component {
	componentDidMount() {
		
		getBitcoinHistory().then( data => {
			console.log(data);
			this.setState({ data })
		});
	}
	render() {
		if (this.state == null) {
			return <div>Loading...</div>
		}
		return (
			<Chart width={1000} height={500} type={"svg"} ratio={1} data={this.state.data} />
		)
	}
}
