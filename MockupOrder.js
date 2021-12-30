class MockupOrder {
    #title
    #details
    #img

    setTitle(title) {
        this.#title = title;
    }
    setDetails(details) {
        this.#details = details;
    }
    setImg(img) {
        this.#img = img;
    }
    show() {
        console.log('title:' + this.#title + "; " + this.#details + '; ' + this.#img)
    }
}

class MockupOrderBuilder {
    #title = 'Advertisment title'
    #details = 'No details'
    #img = 'No img'

    buildTitle(title) {
        this.#title = title;
        return this;
    }
    buildDetails(details) {
        this.#details = details;
        return this;
    }
    buildImg(img) {
        this.#img = img;
        return this;
    }
    build() {
        let order = new MockupOrder();
        order.setTitle(this.#title);
        order.setDetails(this.#details);
        order.setImg(this.#img);
        console.log(order);
        return order;
    }
}

module.exports.MockupOrder = this.MockupOrder;
module.exports.MockupOrderBuilder = this.MockupOrderBuilder;
