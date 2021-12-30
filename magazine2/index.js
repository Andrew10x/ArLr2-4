let express = require('express');
const DB = require('./DB');
const Filter = require('./Filter')

const app = express();
const PORT = 4000;

app.listen(PORT, err => {
    err ? console.log(err) : console.log('Server started!');
  });

  app.get('/search', async function(req, res){
    ///search?max-price=1000&min-price=500
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    await delay(15000);
    const f = new Filter(req.query);
    const data = await f.getFilteredData();
    res.send(data);
}) 