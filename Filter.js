const DBSingleton = require('./DBSingleton');
const DB2 = require('./Magazine2');

class Filter {
    _filterObj
    constructor(fObj) {
        this._filterObj = fObj;
    }

    filter() {
        let qwf = 'select * from AdvPlaceList pl left join AdvOrders o on pl.AdvPlaceId = o.AdvPlaceId where true';
        
        if(this._filterObj.hasOwnProperty('maxPrice'))
            qwf += ` and pl.price <= ${this._filterObj.maxPrice}`;
        if(this._filterObj.hasOwnProperty('minPrice'))
            qwf += ` and pl.price >= ${this._filterObj.minPrice}`;
        if(this._filterObj.hasOwnProperty('freePlace')) {
            if(this._filterObj.freePlace === 'true')
                qwf += ` and pl.status = 'free'`;
            else 
                qwf += ` and pl.status != 'free'`; 
        }
        if(this._filterObj.hasOwnProperty('magazineNumber')) {
            qwf += ` and pl.magazinenumber = ${this._filterObj.magazineNumber}`;
        }

        return qwf;
    }

    async getFilteredData() {
        const qwf = this.filter();
        const dbcon = new DBSingleton();
        const data =  await dbcon.makeQuery(qwf);
        return data;
    }

}

module.exports = Filter;

