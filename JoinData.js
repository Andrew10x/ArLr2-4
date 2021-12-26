const DBSingleton = require('./DBSingleton');
const DB2 = require('./Magazine2');
const DB3 = require('./Magazine3');

class JoinData {
    #data 
    #mainCon = new DBSingleton();
    #con2 = new DB2();
    #con3 = new DB3();

    async uniteAll() {
        this.#data =  await this.#mainCon.getData();
        this.#data = this.#data.concat(await this.#con2.getData());
        this.#data = this.#data.concat(await this.#con3.getData());
    }

    async updateData(pageNumb=0) {
        this.#data = await this.#mainCon.getUpData(pageNumb);
        //console.log('fds', this.#data)
    }

    getData() {
        return this.#data;
    }
}

async function main() {
    let j = new JoinData();
    await j.uniteAll();
    console.log(j.getData());
}

//main();

module.exports = JoinData;