require('dotenv').config();
pg = require('pg')
const e = require('express');
let express = require('express');
const { maxSatisfying } = require('semver');

const DB2 = require('./Magazine2');
const DB3 = require('./Magazine3');


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
        //console.log('page', pageNumb == 1)
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
        return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
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
        
        //console.log(this.getData())
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
        let dataFromDB2 = await new DB2().getData();
        for(let i=0; i<dataFromDB2.length; i++){
            await this.addPlaceList(dataFromDB2[i].place, dataFromDB2[i].price, dataFromDB2[i].status,2);
        }
        let dataFromDB3 = await new DB3().getData();
        for(let i=0; i<dataFromDB3.length; i++){
            await this.addPlaceList(dataFromDB3[i].place, dataFromDB3[i].price, dataFromDB3[i].status,3);
        }


        await this.setDate();
        /*for(let i=0; i<dataFromDB2.length; i++){
            const dub = await this.pool.query(`select * from AdvPlaceList 
            where place=${dataFromDB2[i].place} and magazinenumber=2`);
            if(!dub.length) {
                await this.addPlaceList(dataFromDB2.place, dataFromDB2.price, dataFromDB2.status,2);
            
            }
        }*/
        /*
        let dataFromDB3 = await new DB3().getData();
        for(let i=0; i<dataFromDB3.length; i++){
            const dub = await this.pool.query(`select * from AdvPlaceList 
            where place=${dataFromDB3[i].place} and magazinenumber=3`);
            if(!dub.length) {
                await this.addPlaceList(dataFromDB3.place, dataFromDB3.price, dataFromDB3.status,3);
            }
        }*/
    }
}

const main = async() => {
    conn = new DBSingleton();
    console.log(await conn.getPlaceList(1))
    //let  data = await conn.getData();
    //conn.addOrder(3, 'Обміняю качок Каролінок на курей, на птицю або інше, пропонуйте варіанти 1000грн.')
    //conn.updateOrder(13, 'New text')
    //conn.deleteOrder(3, 13)

    //await conn.addNewData();
    //console.log('dsf', await conn.getUpData())


}

main()


module.exports = DBSingleton;
