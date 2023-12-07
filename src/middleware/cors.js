const cors = require('cors')
/* eslint-disable */
const whitelist = new Set(['http://127.0.0.1', 'http://localhost:3000', 'http://127.0.0.1:8080', 'http://127.0.0.1:3000', 'http://172.26.93.12'])
/* eslint-enable */
const corsOptions = {
  optionsSuccessStatus: 200,
  // origin: function (origin, callback) {
  //   console.log('Request origin:', origin);
  //   if (whitelist.has(origin)) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error('Not allowed by CORS'));
  //   }
  // },
  origin: '*',
  credentials: true,
  exposedHeaders: ['set-cookie']
}

module.exports = cors(corsOptions)
