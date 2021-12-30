let express = require('express');
const DB = require('./DB');


const app = express();
const PORT = 5000;

app.listen(PORT, err => {
    err ? console.log(err) : console.log('Server started!');
  });

app.get('/details/:id', async function(req, res){
    const conn = new DB();
    let data = await conn.getDetails(req.params.id);
    res.send(data);
})

app.get('/price-list', async function(req, res){
    const conn = new DB();
    let data = await conn.getPlaceList();
    res.send(data);
})

app.get('/price-list/:id', async function(req, res){
    const conn = new DB();
    let data = await conn.getPlaceList(req.params.id);
    res.send(data);
})