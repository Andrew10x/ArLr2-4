const { MaxPriceSpecification, MinPriceSpecification, FreePlaceSpecification, MagazineNumberSpecification } = require('./Specification');

sp = require('./Specification')

class Filter {
    #priority;
    #next = null;
    _filter_obj = {};
    constructor(pr, f_obj) {
        this.#priority = pr;
        this._filter_obj = f_obj;
    }

    setNext(n) {
        this.#next = n;
    }

    makeFilter(level, data) {
        if(level<=this.#priority) {
            data = this.filter(data);
        }
        if(this.#next) {
            data = this.#next.makeFilter(level, data);
        }
        return data;
    }

    filter(data) {
        throw new Error("Method 'filter()' must be implemented.");
    }
}

class MaxPriceFilter extends Filter {
    constructor(pr, f_obj) {
        super(pr, f_obj);
    }

    filter(data) {
        if(this._filter_obj.hasOwnProperty('maxPrice')) {
            const mps = new MaxPriceSpecification;
            return data.filter(item => mps.isSatisfiedBy(item, this._filter_obj.maxPrice));
        }
        return data;
    }
}

class MinPriceFilter extends Filter {
    constructor(pr, f_obj) {
        super(pr, f_obj);
    }

    filter(data) {
        if(this._filter_obj.hasOwnProperty('minPrice')) {
            const mps = new MinPriceSpecification;
            return data.filter(item => mps.isSatisfiedBy(item, this._filter_obj.minPrice));
        }
        return data;
    }
}

class FreePlaceFilter extends Filter {
    constructor(pr, f_obj) {
        super(pr, f_obj);
    }

    filter(data) {

        if(this._filter_obj.hasOwnProperty('freePlace')) {
            const fps = new FreePlaceSpecification;
            return data.filter(item => fps.isSatisfiedBy(item, this._filter_obj.freePlace));
        }
        return data;
    }
}

class MagazineNumberFilter extends Filter {
    constructor(pr, f_obj) {
        super(pr, f_obj);
    }

    filter(data) {

        if(this._filter_obj.hasOwnProperty('magazineNumber')) {
            const mns = new MagazineNumberSpecification;
            return data.filter(item => mns.isSatisfiedBy(item, this._filter_obj.magazineNumber));
        }
        return data;
    }
}

let advPlaceArr1 = [
    {price: '300'}, 
    {price: '1000'}
]


let data = [{"advplaceid":1,"place":1,"price":4200,"status":"taken","magazinenumber":1,"advorderid":1,"details":"Вулик – виготовлений з сосни 30 мм.\nтак і 35 мм. Максимальна вологість матеріалу до 15%.\nПроклейка вулика використовується водостійкий клей, а не вологостійкий. 1500грн"},{"advplaceid":null,"place":2,"price":4325,"status":"free","magazinenumber":1,"advorderid":null,"details":null},{"advplaceid":null,"place":3,"price":4000,"status":"free","magazinenumber":1,"advorderid":null,"details":null},{"advplaceid":null,"place":4,"price":3570,"status":"taken","magazinenumber":1,"advorderid":null,"details":null},{"advplaceid":null,"place":5,"price":3230,"status":"free","magazinenumber":1,"advorderid":null,"details":null},{"advplaceid":null,"place":6,"price":3200,"status":"free","magazinenumber":1,"advorderid":null,"details":null},{"advplaceid":null,"place":7,"price":2800,"status":"free","magazinenumber":1,"advorderid":null,"details":null},{"advplaceid":8,"place":8,"price":3000,"status":"taken","magazinenumber":1,"advorderid":3,"details":"Покращений, компактний і зручний портативний телескоп - 16X52, день/ніч.\nМонокулярний телескоп з подвійною фокусуванням, до 8.000 метрів, для полювання,\nтуризму, екскурсій, концертів, риболовлі, парусного спорту і т.д. 800грн"},{"advplaceid":null,"place":9,"price":3800,"status":"free","magazinenumber":1,"advorderid":null,"details":null},{"advplaceid":10,"place":10,"price":4000,"status":"taken","magazinenumber":1,"advorderid":2,"details":"Апирой (2 феромону (1 бан.х 25 гр)) гель опис Для залучення і упіймання роїв \n на пасіках в період роїння бджолиних сімей.Склад: гераніол-0.05%; цитраль-0.05%;  \n масло меліси-0.05%; масло м`яти-0.05%; масло лимона-0.05%. 200грн"}]
let f_obj = {
    'maxPrice': '3200',
    'minPrice': '3000',
    'freePlace': 'true'
}

//let d = work(data, f_obj);
//console.log(d)

function work(advPlaceArr, f_obj) {
    let f1 = new MaxPriceFilter(1, f_obj);
    let f2 = new MinPriceFilter(2, f_obj);
    let f3 = new FreePlaceFilter(3, f_obj);
    let f4 = new MagazineNumberFilter(4, f_obj);

    f1.setNext(f2);
    f2.setNext(f3);
    f3.setNext(f4);  

    return f1.makeFilter(1, advPlaceArr);
}

module.exports.work = work;
