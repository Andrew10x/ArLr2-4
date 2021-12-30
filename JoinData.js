const DBSingleton = require('./DBSingleton');
const DB2 = require('./Magazine2');
const DB3 = require('./Magazine3');

class JoinData {
    #data 
    #mainCon = new DBSingleton();


    async updateData(pageNumb=0) {
        this.#data = await this.#mainCon.getUpData(pageNumb);
        return this.#data;
    }

    getData() {
        return this.#data;
    }
}

async function main() {
    let j = new JoinData();
    console.log(j.getData());
}

//main();

module.exports = JoinData;