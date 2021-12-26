require('dotenv').config();
pg = require('pg')
let express = require('express');


let app = express();


class DB2 {
    #config = {
        user: 'postgres',
        host: 'localhost',
        database: 'Magazine2',
        password: '1234',
        port: 5432,
    };

    pool

    constructor() {
        if(typeof DB2.instance === 'object') {
            return DB2.instance;
        }
        DB2.instance = this;
        this.pool = new pg.Pool(this.#config);
        return this;
    }

    async getData() {
        await this.delay(15000)
        //console.log('Hello')
        let r = await this.pool.query('select * from AdvPlaceList pl left join AdvOrders o on pl.AdvPlaceId = o.AdvPlaceId')
        let data = Object.values(r.rows)
        return data;
    }

    async getFirst() {
        let r = await this.pool.query('select * from AdvOrders')
        let data = Object.values(r.rows)
        return data;
    }

    async getPlaceList() {
        let r = await this.pool.query('select * from AdvPlaceList')
        let data = Object.values(r.rows)
        return data;
    }

    getPool() {
        return this.pool;
    }

    delay = ms => new Promise(resolve => setTimeout(resolve, ms))
}

const main = async() => {
    conn = new DB2();
    let  data = await conn.getData();
    //console.log(data)
}

//main()


module.exports = DB2;
