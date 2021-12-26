//pg = require('pg')
const express = require('express');
const DBSingleton = require('./DBSingleton');
const DB2 = require('./Magazine2');
const DB3 = require('./Magazine3');

const app = express();


/*class DBSingleton {
    #config = {
        user: 'postgres',
        host: 'localhost',
        database: 'MainMagazine',
        password: '1234',
        port: 5432,
    };

    pool

    constructor() {
        if(typeof DBSingleton.instance === 'object') {
            return DBSingleton.instance;
        }
        DBSingleton.instance = this;
        this.pool = new pg.Pool(this.#config);
        return this;
    }

    getPool() {
        return this.pool;
    }
}

let dbcon = new DBSingleton();
let data;
(async function f() {
    let r = await dbcon.pool.query('select * from AdvPlaceList pl left join AdvOrders o on pl.AdvPlaceId = o.AdvPlaceId')
    //data = Object.values(r.rows)
    data = r.rows;
}())*/

function myFilter(myData, obj) {
    //console.log("Mydata", myData)
    //console.log(obj);
    return myData.filter(d => d.price <= obj.maxPrice)
}


app.get('/search', async function(req, res){
    //search?max-price=1000&min-price=500
    const conn = new DBSingleton();
    let data = await conn.getData();
    data = myFilter(data, req.query)
    res.send(data)
})

app.listen(3000);