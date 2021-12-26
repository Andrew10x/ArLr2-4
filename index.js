pg = require('pg');
let express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;

const {work} = require('./ChainOfEvents');
const DBSingleton = require('./DBSingleton');
const DB2 = require('./Magazine2');
const DB3 = require('./Magazine3');
const schema = require('./schema');

const JoinData = require('./JoinData');
let app = express();
const PORT = 3004;

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(PORT, err => {
    err ? console.log(err) : console.log('Server started!');
  });

const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'MainMagazine',
    password: '1234',
    port: 5432,
};
/*
let data;
const pool = new pg.Pool(config);
(async function f() {
    let r = await pool.query('select * from AdvPlaceList pl left join AdvOrders o on pl.AdvPlaceId = o.AdvPlaceId')
    console.log(r)
    //console.log(Object.values(r.rows[0]))
    data = Object.values(r.rows)
    //console.log(data)
}())
*/

//let dbcon = new DBSingleton();
//let data;
/*(async function f() {
    let r = await dbcon.pool.query('select * from AdvPlaceList pl left join AdvOrders o on pl.AdvPlaceId = o.AdvPlaceId')
    console.log(r)
    //console.log(Object.values(r.rows[0]))
    data = Object.values(r.rows)
    //console.log(data)
}())
*/
app.get('/', async function(req, res){
    const j = new JoinData();
    await j.updateData();
    let data = j.getData();
    data = work(data, req.query)
    res.send(data)
})

app.get('/page/:id', async function(req, res){
    const j = new JoinData();
    await j.updateData(req.params.id);
    let data = j.getData();
    data = work(data, req.query)
    res.send(data)
})

app.get('/search', async function(req, res){
    ///search?max-price=1000&min-price=500
    //console.log('Hi')
    const conn = new DB2();
    let data = await conn.getData();
    data = work(data, req.query)
    //let data = await conn.getFirst();
    res.send(data)
}) 

app.get('/details/:id', async function(req, res){
    const conn = new DB3();
    let data = await conn.getDetails(req.params.id);
    //let detailedAdv = data.find((adv) => adv.place === Number(req.params.id))
    res.send(data);
})

app.get('/price-list', async function(req, res){
    const conn = new DB3();
    let data = await conn.getPlaceList();
    res.send(data);
})

 

//app.listen(3000);