
class Specification {
    
    constructor() {
        if (this.constructor == Specification) {
          throw new Error("Abstract classes can't be instantiated.");
        }
      }
    
      isSatisfiedBy() {
        throw new Error("Method 'isStatisfiedBy()' must be implemented.");
      }
};

class MaxPriceSpecification extends Specification{
    isSatisfiedBy(advPlace, maxPrice) {
        return advPlace.price <= maxPrice;
    }
}

class MinPriceSpecification extends Specification{
    isSatisfiedBy(advPlace, minPrice) {
        return advPlace.price >= minPrice;
    }
}

class FreePlaceSpecification extends Specification{
    isSatisfiedBy(advPlace, freePlace) {
        console.log("f ", freePlace)
        if(freePlace == 'true') {
            return advPlace.status === 'free'
        }
        else{
            return advPlace.status != 'free'
        }

    }
}

class MagazineNumberSpecification extends Specification{
    isSatisfiedBy(advPlace, magazineNumber) {
        console.log(magazineNumber);
        return advPlace.magazinenumber == magazineNumber
    }
}

module.exports.MaxPriceSpecification = MaxPriceSpecification;
module.exports.MinPriceSpecification = MinPriceSpecification;
module.exports.FreePlaceSpecification = FreePlaceSpecification;
module.exports.MagazineNumberSpecification = MagazineNumberSpecification;
