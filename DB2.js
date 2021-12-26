const pg = require('pg')

const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'MainMagazine',
    password: '1234',
    port: 5432,
};

class DbSingletonService {
    db // Pool
    constructor() {
        this.db =  new pg.Pool(config)

    }

    isInitialized() {
        return this.db !== undefined;
    }

    getClient() {
        if (this.isInitialized()) return this.db;

        // Initialize the connection.

        this.db = new pg.Pool(config)
        return this.db;
    }
    async select(){

        console.log( (await this.db.query(`select 'dxcfgvhkbj'`)).rows[0])
    }
}

const db = new DbSingletonService

db.select()