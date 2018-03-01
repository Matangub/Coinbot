
import React from "react";
import PropTypes from "prop-types";

import { scaleTime } from "d3-scale";
import { utcDay } from "d3-time";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import { CandlestickSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last, timeIntervalBarWidth } from "react-stockcharts/lib/utils";
import { ema, sma, macd, bollingerBand } from "react-stockcharts/lib/indicator";

import {
	CrossHairCursor,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import {
	BarSeries,
	LineSeries,
	BollingerSeries,
	AreaSeries,
	MACDSeries
} from "react-stockcharts/lib/series";

import {
	OHLCTooltip,
	MovingAverageTooltip,
	MACDTooltip,
} from "react-stockcharts/lib/tooltip";

const bbStroke = {
	top: "#964B00",
	middle: "#000000",
	bottom: "#964B00",
};

const bbFill = "#4682B4";

const macdAppearance = {
	stroke: {
		macd: "#FF0000",
		signal: "#00F300",
	},
	fill: {
		divergence: "#4682B4"
	},
};

const mouseEdgeAppearance = {
	textFill: "#542605",
	stroke: "#05233B",
	strokeOpacity: 1,
	strokeWidth: 3,
	arrowWidth: 5,
	fill: "#BCDEFA",
};

class CandleStickChart extends React.Component {

	fill(d) {
		return d.close > d.open ? "#4CAF50" : "#F44336";
	}

	render() {


		const ema20 = ema()
			.options({
				windowSize: 20, // optional will default to 10
				sourcePath: "close", // optional will default to close as the source
			})
			.skipUndefined(true) // defaults to true
			.merge((d, c) => {d.ema20 = c;}) // Required, if not provided, log a error
			.accessor(d => d.ema20) // Required, if not provided, log an error during calculation
			.stroke("blue"); // Optional

		const sma20 = sma()
			.options({ windowSize: 20 })
			.merge((d, c) => {d.sma20 = c;})
			.accessor(d => d.sma20);

		const ema50 = ema()
			.options({ windowSize: 50 })
			.merge((d, c) => {d.ema50 = c;})
			.accessor(d => d.ema50);

		const smaVolume50 = sma()
			.options({ windowSize: 20, sourcePath: "volume" })
			.merge((d, c) => {d.smaVolume50 = c;})
			.accessor(d => d.smaVolume50)
			.stroke("#4682B4")
			.fill("#4682B4");

		const ema26 = ema()
			.id(0)
			.options({ windowSize: 26 })
			.merge((d, c) => { d.ema26 = c; })
			.accessor(d => d.ema26);

		const ema12 = ema()
			.id(1)
			.options({ windowSize: 12 })
			.merge((d, c) => {d.ema12 = c;})
			.accessor(d => d.ema12);

		const macdCalculator = macd()
			.options({
				fast: 12,
				slow: 26,
				signal: 9,
			})
			.merge((d, c) => {d.macd = c;})
			.accessor(d => d.macd);

		const bb = bollingerBand()
			.merge((d, c) => {d.bb = c;})
			.accessor(d => d.bb);

		const { type, width, data, ratio, zoomEvent, mouseMoveEvent } = this.props;
		const xAccessor = d => d.mts;
		const xExtents = [
			xAccessor(last(data)),
			xAccessor(data[data.length - 30])
		];

		const height = this.props.height;

		var margin = { left: 50, right: 50, top: 0, bottom: 30 };
		const gridHeight = height - margin.top - margin.bottom;
		const gridWidth = width - margin.left - margin.right;

		const showGrid = true;
		const yGrid = showGrid ? { innerTickSize: -1 * gridWidth, tickStrokeOpacity: 0.2 } : {};
		const xGrid = showGrid ? { innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.2 } : {};


		return (
			<ChartCanvas height={height}
					ratio={ratio}
					width={width}
					mouseMoveEvent={mouseMoveEvent}
					margin={margin}
					type={type}
					seriesName="MSFT"
					data={data}
					xAccessor={xAccessor}
					displayXAccessor={xAccessor}
					xScale={scaleTime()}
					xExtents={xExtents}>

				<Chart id={1} yExtents={d => [d.high, d.low]}>
					<XAxis {...xGrid} stroke="#687d7e" tickStroke="#687d7e" axisAt="bottom" fontSize={12} orient="bottom" ticks={6}/>
					<YAxis {...yGrid} stroke="#687d7e" tickStroke="#687d7e" axisAt="left" fontSize={12} orient="left" ticks={5} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")}
					/>
					<CandlestickSeries
						wickStroke={ this.fill }
					  fill={this.fill}
					  stroke={"#000000"}
					  candleStrokeWidth={1}
					  widthRatio={0.8}
					  opacity={1} />
				</Chart>

				<Chart id={2} origin={(w, h) => [0, h - 50]} height={50} yExtents={d => d.volume}>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".2s")}/>
					<BarSeries yAccessor={d => d.volume} fill={(d) => d.close > d.open ? "#6BA583" : "red"} />
				</Chart>

				<Chart id={3} height={150}
					yExtents={macdCalculator.accessor()}
					origin={(w, h) => [0, h - 150]} padding={{ top: 10, bottom: 10 }}
				>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={2} />

					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")}
						rectRadius={5}
						{...mouseEdgeAppearance}
					/>
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")}
						{...mouseEdgeAppearance}
					/>

				<MACDSeries yAccessor={(d) => {return d.macd}}
						{...macdAppearance} />
					<MACDTooltip
						origin={[-38, 15]}
						yAccessor={d => d.macd}
						options={macdCalculator.options()}
						appearance={macdAppearance}
					/>
				</Chart>
				<CrossHairCursor stroke={'#fff'} color={'#fff'} />
			</ChartCanvas>
		);
	}
}

CandleStickChart.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChart.defaultProps = {
	type: "svg",
};
CandleStickChart = fitWidth(CandleStickChart);

export default CandleStickChart;
