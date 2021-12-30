let express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const axios = require('axios');

const schema = require('./schema');
const Filter = require('./Filter');

const app = express();
const PORT = 3000;

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(PORT, err => {
    err ? console.log(err) : console.log('Server started!');
  });

app.get('/', async function(req, res){
    const f = new Filter(req.query);
    const data = await f.getFilteredData();
    res.send(data)
})

app.get('/search', async function(req, res){

    const url = createUrl('http://localhost:4000/search?', req.query);
    axios.get(url)
    .then(({data}) => res.send(data));  
}) 

app.get('/details/:id', async function(req, res){
    axios.get(`http://localhost:5000/details/${Number(req.params.id)}`)
    .then(({data}) => res.send(data)); 
})

app.get('/price-list/:id', async function(req, res){
    const data = axios.get(`http://localhost:5000/price-list/${Number(req.params.id)}`)
    .then(({data}) => res.send(data));
})

function createUrl(url, filterObj) {
    if(filterObj.hasOwnProperty('maxPrice'))
        url += `maxPrice=${filterObj.maxPrice}&`
    if(filterObj.hasOwnProperty('minPrice'))
        url += `minPrice=${filterObj.minPrice}&`
    if(filterObj.hasOwnProperty('freePlace'))
        url += `freePlace=${filterObj.freePlace}`

    return url;
}
