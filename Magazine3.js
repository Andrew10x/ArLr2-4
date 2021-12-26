require('dotenv').config();
pg = require('pg')
let express = require('express');


let app = express();


class DB3 {
    #config = {
        user: 'postgres',
        host: 'localhost',
        database: 'Magazine3',
        password: '1234',
        port: 5432,
    };

    pool

    constructor() {
        if(typeof DB3.instance === 'object') {
            return DB3.instance;
        }
        DB3.instance = this;
        this.pool = new pg.Pool(this.#config);
        return this;
    }

    async getData(pageNumb=0) {
        let r;
        if(!pageNumb){
            r = await this.pool.query('select * from AdvPlaceList pl left join AdvOrders o on pl.AdvPlaceId = o.AdvPlaceId')
        }
        else {
            const left = 5000*(pageNumb-1) + 1;
            const right = 5000*pageNumb;
            r = await this.pool.query(`select * from AdvPlaceList pl left join AdvOrders o on pl.AdvPlaceId = o.AdvPlaceId
            where pl.place between ${left} and ${right}; `)
        }
        const data = Object.values(r.rows)
        return data;
    }

    async getAdvOrders(pageNumb=0) {
        let r;
        if(!pageNumb) {
            r = await this.pool.query('select * from AdvOrders')
        }
        else {
            const left = 5000*(pageNumb-1) + 1;
            const right = 5000*pageNumb;
            r = await this.pool.query(`select * from AdvOrders where advorderid between ${left} and ${right};`)
        }
        let data = Object.values(r.rows)
        return data;
    }

    async getPlaceList(pageNumb=0) {
        let r;
        if(!pageNumb) {
            r = await this.pool.query('select * from AdvPlaceList');
        }
        else {
            const left = 5000*(pageNumb-1) + 1;
            const right = 5000*pageNumb;
            r = await this.pool.query(`select * from AdvPlaceList where place between ${left} and ${right};`);
        }
        let data = Object.values(r.rows)
        return data;
    }

    async getDetails(id) {
        let r = await this.pool.query(`select * from AdvPlaceList pl
         left join AdvOrders o on pl.AdvPlaceId = o.AdvPlaceId where pl.advPlaceId=${id}`)
        let data = Object.values(r.rows)
        return data;
    }

    getPool() {
        return this.pool;
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
      }

    async generatePlaceLists() {
        for(let i=11; i<50001; i++) {
            const price = this.getRandomInt(1000, 10000)
            await this.pool.query(`
            insert into AdvPlaceList(place, price, status)
            values(${i}, ${price}, 'free')`)
        }
    }
}

const main = async() => {
    conn = new DB3();
    const data = await conn.getAdvOrders(2);
    //console.log(data);
}

//main()


module.exports = DB3;
