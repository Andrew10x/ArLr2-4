class AdvOrder {
    #details
    #img
    #user

    setDetails(details) {
        this.#details = details;
    }
    setImg(img) {
        this.#img = img;
    }

    setUser(user) {
        this.#user = user;
    }
    show() {
        console.log(this.#details + '; ' + this.#img + '; ' + this.#user)
    }
}

class AdvOrderBuilder {
    #details = 'No details'
    #user = 1
    #img = 'No img'

    buildDetails(details) {
        this.#details = details;
        return this;
    }
    buildImg(img) {
        this.#img = img;
        return this;
    }
    build() {
        let order = new AdvOrder();
        order.setDetails(this.#details);
        order.setImg(this.#img);
        order.setUser(this.#user);
        console.log(order);
        return order;
    }
}

module.exports.AdvOrder = AdvOrder;
module.exports.AdvOrderBuilder = AdvOrderBuilder;

