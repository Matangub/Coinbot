import React from 'react';
import ReactDOM from 'react-dom';
import request from 'superagent'

import colors from '../../consts/colors'

export default class Dashboard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currencies: [],
      news_feed: []
    };
  }

  getCurrenciesPrices() {
    request.get('https://api.coinmarketcap.com/v1/ticker/?limit=30').end((err, res) => {
      this.setState({currencies: res.body});
    });
  }

  get_rss_news() {
    request.get('https://newsapi.org/v2/top-headlines?sources=crypto-coins-news&apiKey=3b77cb596ba048478a94b916602ebf17').end((err, res) => {
      this.setState({news_feed: res.body.articles})
    });
  }

  componentDidMount() {
    var ctx = document.getElementById('myChart').getContext('2d');
    var data = [0, 10, 5, 2, 20, 30, 45];
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                label: "dataset",
                backgroundColor: colors.graph_color,
                borderColor: colors.graph_border,
                pointBackgroundColor: colors.graph_color,
                data: data,
            }]
        },

        // Configuration options go here
        options: {
          legend: {
              display: false
          },
          tooltips: {
              callbacks: {
                 label: function(tooltipItem) {
                        return tooltipItem.yLabel;
                 }
              }
          }
        }
    });

    // For a pie chart

    var myPieChart = new Chart(ctx2,{
        type: 'pie',
        data: {
            datasets: [{
                backgroundColor: [
                  "#673AB7",
                  "#3F51B5",
                  "#2196F3",
                  "#009688",
                ],
                data: [10, 20, 30, 40]
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                'Bitcoin',
                'Etherium',
                'Ripple',
                'Bitcoin cash'
            ]
        },
        options: {}
    });

    this.getCurrenciesPrices();
    this.get_rss_news();

    // setInterval( () => {
    //
    //   if(this.isMounted()) {
    //
    //     this.get_rss_news();
    //     this.getCurrenciesPrices();
    //   }
    //
    // }, 3000 0);

  }

  return_change_color(value) {

    return (value > 0) ? 'positive_trend' : 'negative_trend';
  }

  news_link(url) {
    document.location.href = url;
  }

  render() {
    return (
      <div className="main_wrapper contrainer_padding">

        <div className="container-fluid">

          <div className="row">
            <div className="col-8 graph_wrapper"> {/*style={{borderRight: '1px solid #9E9E9E'}}*/}

            <div>
              <h3 className="dashboard_title" style={{color: colors.text_color}}>TOTAL PROFITS </h3>
              <div className="btn-group graph_buttons_wrapper" role="group" aria-label="Basic example">
                <button type="button" className="btn btn-secondary">24H</button>
                <button type="button" className="btn btn-secondary">7D</button>
                <button type="button" className="btn btn-secondary">1M</button>
                <button type="button" className="btn btn-secondary">3M</button>
                <button type="button" className="btn btn-secondary">1Y</button>
              </div>
            </div>

            <canvas className="dashboard_graph" id="myChart"></canvas>
            </div>
            <div className="col-4 graph_wrapper">
              <h3 className="dashboard_title" style={{color: colors.text_color}}> CURRENCIES PORTFOLIO </h3>
              <canvas className="dashboard_pie" id="ctx2"></canvas>
            </div>
          </div>

          <div className="row bottom_dashboard">
            <div className="col-8">
              <h3 className="dashboard_title" style={{color: colors.text_color}}> CRYPTO CURRENCIES </h3>
              <div className="table_wrapper">
                <table className="table table-striped table-hover table-dark">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Symbol</th>
                      <th scope="col">Price</th>
                      <th scope="col">1H change</th>
                      <th scope="col">24H change</th>
                      <th scope="col">7D change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.currencies.map( (item) => {
                          return (
                            <tr key={item.id}>
                              <td> { item.name } </td>
                              <td> { item.symbol } </td>
                              <td> { item.price_usd } </td>
                              <td className={ this.return_change_color(item.percent_change_1h) }>{ item.percent_change_1h }%</td>
                              <td className={ this.return_change_color(item.percent_change_24h) }>{ item.percent_change_24h }%</td>
                              <td className={ this.return_change_color(item.percent_change_7d) }>{ item.percent_change_7d }%</td>
                            </tr>
                          )})
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-4">
            <h3 className="dashboard_title" style={{color: colors.text_color}}> CRYPTO NEWS </h3>

            <div className="table_wrapper">
              <table className="table table-striped table-hover table-dark news_table">
                <tbody>
                  {
                    this.state.news_feed.map( (item, index) => {
                        return (
                            <tr key={index} onClick={this.news_link.bind(this, item.url)}>
                              <td>
                                <img  width="75" src={item.urlToImage} />
                              </td>
                              <td> { item.title } </td>
                            </tr>
                        )})
                  }
                </tbody>
              </table>
            </div>

            </div>
          </div>

        </div>
      </div>
    );
  }
}
