require('dotenv').config();
pg = require('pg')
let express = require('express');;
const axios = require('axios');

let app = express();


class DBSingleton {
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

    async getData(pageNumb=0) {
        let r;
        if(pageNumb == 0)
            r = await this.pool.query('select * from AdvPlaceList pl left join AdvOrders o on pl.AdvPlaceId = o.AdvPlaceId')
        else {
            const left = 5000*(pageNumb-1) + 1;
            const right = 5000*pageNumb;
            r = await this.pool.query(`select * from AdvPlaceList pl left join AdvOrders o 
            on pl.AdvPlaceId = o.AdvPlaceId where pl.place between ${left} and ${right}`)
        
        }
        
        let data = Object.values(r.rows)
        return data;
    }

    async makeQuery(q) {
        let r = await this.pool.query(q)
        let data = Object.values(r.rows)
        return data;
    }

    async getAdvOrders() {
        let r = await this.pool.query('select * from AdvOrders')
        let data = Object.values(r.rows)
        return data;
    }

    async getPlaceLists() {
        let r = await this.pool.query('select * from AdvPlaceList')
        let data = Object.values(r.rows)
        return data;
    }

    async getCompanyUsers() {
        let r = await this.pool.query('select * from CompanyUser')
        let data = Object.values(r.rows)
        return data;
    }

    async getPlaceList(id) {
        let r = await this.pool.query(`select * from AdvPlaceList where advplaceid=${Number(id)}`)
        let data = Object.values(r.rows)
        return data;
    }

    async getCompanyUser(id) {
        let r = await this.pool.query(`select * from CompanyUser where userid=${Number(id)}`)
        let data = Object.values(r.rows)
        return data;
    }

    getPool() {
        return this.pool;
    }

    async addOrder(place, details) {
        await this.pool.query(`insert into AdvOrders(details, advPlaceId)
        values('${details}', ${place})`);

        await this.updatePlaceListStatus('taken', place);
    }

    async addCompanyUser(userObj) {
        await this.pool.query(`insert into CompanyUser(FirstName, MiddleName, LastName, email)
        values('${userObj.firstname}', '${userObj.middlename}', '${userObj.lastname}', '${userObj.email}')`);
    }

    async addAdvPlaceList(advplObj) {
        await this.pool.query(`insert into AdvPlaceList(place, price, status)
        values(${advplObj.place}, ${advplObj.price}, '${advplObj.status}')`);
    }

    async addAdvOrder(advordObj) {
        console.log(advordObj)
        await this.pool.query(`insert into AdvOrders(details, advplaceId, userId)
        values('${advordObj.details}', ${Number(advordObj.advplaceid)}, ${Number(advordObj.userid)}) `);

        await this.updatePlaceListStatus(advordObj.status, advordObj.advplaceid)
    }

    async updateCompanyUser(userObj) {
        await this.pool.query(`update CompanyUser set
        firstname = '${userObj.firstname}', middlename = '${userObj.middlename}', 
        lastname = '${userObj.lastname}', email = '${userObj.email}'
        where userid = ${userObj.userid}`);
    }

    async updateAdvPlaceList(advplObj) {
        await this.pool.query(`update AdvPlaceList set
        place = ${advplObj.place}, price = ${advplObj.price}, status = '${advplObj.status}'
        where advplaceid = ${advplObj.advplaceid}`);
    }

    async updateAdvOrder(advordObj) {
        console.log(advordObj)
        await this.pool.query(`update AdvOrders set
        details = '${advordObj.details}', advplaceid = ${Number(advordObj.advplaceid)}, 
        userid = ${Number(advordObj.userid)} where advorderid = ${advordObj.advorderid}`);
    }

    async deleteCompanyUser(id) {
        await this.pool.query(`delete from CompanyUser where userid=${id}`);
    }

    async deleteAdvPlaceList(id) {
        await this.pool.query(`delete from AdvPlaceList where advplaceid=${id}`)
    }

    async deleteAdvOrder(id, advplaceId) {
        await this.pool.query(`delete from AdvOrders where advorderid=${id}`)
        await this.updatePlaceListStatus('free', advplaceId)
    }

    async updatePlaceListStatus(taken, id) {
        if(taken) {
            await this.pool.query(`update AdvPlaceList set status = '${taken}'
            where advplaceid = ${id}`);
        }
        else {
            await this.pool.query(`update AdvPlaceList set status = 'free'
            where advplaceid = ${id}`);
        }
    }

    async deleteOrder(place, id) {
        await this.pool.query(`delete from advorders
        where advorderid  = ${id}`);
        await this.updatePlaceListStatus('free', place);
    }

    async updateOrder(id, details) {
        await this.pool.query(`update advOrders
        set details = '${details}'
        where advorderid = ${id}`)
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //???????????????? ???? ????????????????????, ?????????????? ????????????????????
      }

    async generatePlaceLists() {
        for(let i=20; i<100001; i++) {
            const price = this.getRandomInt(1000, 10000)
            await this.pool.query(`
            insert into AdvPlaceList(place, price, status)
            values(${i}, ${price}, 'free')`)
        }
    }

    async addPlaceList(place, price, status, magazineNumber) {
        await this.pool.query(`
            insert into AdvPlaceList(place, price, status, magazineNumber)
            values(${place}, ${price}, '${status}', ${magazineNumber})`) 
    }

    async deletePlaceLists(magNumber) {
        await this.pool.query(`delete from AdvPlaceList where magazineNumber=${magNumber}`)
    }

    async getUpData(pageNumb) {
        let today = new Date();
        today = Number(today.setHours(0, 0, 0, 0));
        let date = await this.getDate();
        
        if(Number(date[0].curdate) !== today) 
            this.addNewData();
        
        return this.getData(pageNumb);       
    }

    async setDate() {
        let today = new Date();
        today = Number(today.setHours(0, 0, 0, 0));
        await this.pool.query(`update UpdateDate
        set curdate=${today} where id = 1`);
    }

    async getDate() {
        const r = await this.pool.query('select curdate from UpdateDate where id=1');
        let data = Object.values(r.rows)
        return data;
    }

    async addNewData() {
        this.deletePlaceLists(2);
        this.deletePlaceLists(3);
        let dataFromDB2 = (await axios.get('http://localhost:4000/search')).data;
        let dataFromDB3 = (await axios.get('http://localhost:5000/price-list')).data;
        for(let i=0; i<dataFromDB3.length; i++) {
            const details = (await axios.get(`http://localhost:5000/details/${dataFromDB3[i].advplaceid}`)).data;
            dataFromDB3[i]['advorderid'] = details[0].advorderid;
            dataFromDB3[i]['details'] = details[0].details;
        }
     
        for(let i=0; i<dataFromDB2.length; i++){
            await this.addPlaceList(dataFromDB2[i].place, dataFromDB2[i].price, dataFromDB2[i].status,2);
        }
    
        for(let i=0; i<dataFromDB3.length; i++){
            await this.addPlaceList(dataFromDB3[i].place, dataFromDB3[i].price, dataFromDB3[i].status,3);
        }
        
        await this.setDate();
    }
}

const main = async() => {
    conn = new DBSingleton();
    //await conn.addNewData();
}

//main()


module.exports = DBSingleton;
