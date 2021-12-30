const axios = require('axios')

async function f() {
    axios
      .get('http://localhost:4000/search')
      .then(({ data }) => console.log(data)); 
}

f();