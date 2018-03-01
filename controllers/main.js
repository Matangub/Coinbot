var express = require('express');
var router = express.Router();
import request from 'request'

// Home page route.

router.get('/', function (req, res) {

  function calc_ema(data, n_days) {

  }

  request('https://api.bitfinex.com/v2/candles/trade:30m:tBTCUSD/hist', (err, response, body) => {
      var data = JSON.parse(body).reverse();
      data.map( (item, index) => {
				data[index] = {
          'id': index,
					'mts': item[0],
					'open': item[1],
					'close': item[2],
					'high': item[3],
					'low': item[4],
					'volume': item[5],
          'ema12': item[2]
				}
			})

      // data.map( (item, index) => {
      //   if(index > 11) {
      //
      //       data[index].ema12 = calculate_ema(data, index, 12);
      //   }
			// })
      res.send(data);
  })
})

module.exports = router
