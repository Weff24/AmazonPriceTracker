const http = require('http');
const fs = require('fs');
const express = require('express');
const scraper = require('./scraper');

const app = express();

// Enable server to locate static resources from given root directory
app.use(express.static('public'));

//////////////////////////////////////////////////////////////////////////////////////
app.set('view engine', 'ejs');

//app.use(express.json());       // to support JSON-encoded bodies
// Enable server to read URL-encoded bodies 
app.use(express.urlencoded({extended: false}));


//let prices = [];
let allData = [];

// Server receives requests to access the page and then loads the page
app.get('/', async (reqeust, response) => {
    //response.send(await fs.promises.readFile('./user-home.html', 'utf8'));
    response.render('user-home-temp', {/*currentPrices: prices, names: names*/allData: allData});////////////////
});

// Server receives initial data when user submits a url and ................................
app.post('/add-item-url', (request, response) => {
    scraper.getData(request.body.url)
        .then((/*{ price, name }*/ data) => {//////////////////////////////////////////////////////////////
//            console.log(price);
//            prices.unshift(price);
//            console.log(prices);
            data.maxPrice = data.price;
            data.minPrice = data.price;
            allData.push(data);
            response.redirect('/');
        });
});


app.post('/remove-item', (request, response) => {
    let index = request.body.num;
    allData.splice(index, 1);
    response.redirect('/');
});


// Create and activate server
const server = http.createServer(app);
const port = 3000;
server.listen(process.env.PORT || port, 
    () => console.log('Server is listening on port ' + port));
    
