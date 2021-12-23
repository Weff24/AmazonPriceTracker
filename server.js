const http = require('http');
const fs = require('fs');
const express = require('express');
const scraper = require('./scraper');
const mongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectId;
const assert = require('assert');
const res = require('express/lib/response');
//////////////////////////////////////////////////const { report } = require('process');

const app = express();

// Enable server to locate static resources from given root directory
app.use(express.static('public'));

//////////////////////////////////////////////////////////////////////////////////////
app.set('view engine', 'ejs');

//app.use(express.json());       // to support JSON-encoded bodies
// Enable server to read URL-encoded bodies 
app.use(express.urlencoded({extended: false}));


//let prices = [];
//let allData = [];
let uri = 'mongodb://localhost:27017';

// Server receives requests to access the page and then loads the page
app.get('/', (req, res) => {
    res.render('home');
    
    //response.send(await fs.promises.readFile('./user-home.html', 'utf8'));
    //response.render('user-home', {/*currentPrices: prices, names: names*/allData: allData});
});


// Gets username and redirects to specified user's page
app.post('/goto-user', (req, res) => {
    res.redirect('/user/' + req.body.username);
});


// Server loads all the data in the specified user's page
app.get('/user/:username', (req, res) => {
    let username = req.params.username;
    let resultArray = [];
    mongoClient.connect(uri, (err, client) => {
        if (err) throw err;
        let db = client.db('users');
        let cursor = db.collection(username).find();

        // Create database collection for specified username
        db.listCollections({ name: username })
            .next((err, info) => {
                if (!info) {
                    db.createCollection(username);
                }
            });

        // Get saved items from database
        cursor.forEach((doc, err) => {
            if (err) throw err;
            resultArray.push(doc);
        }, () => {
            client.close();
            res.render('user-home', { allData: resultArray, name: username });
        });
    });
})


// Server receives initial data when user submits a url and ................................
app.post('/add-item-url', (req, res) => {
    let username = req.body.username;

    scraper.getData(req.body.url)
        .then((/*{ price, name }*/ data) => {//////////////////////////////////////////////////////////////
//            console.log(price);
//            prices.unshift(price);
//            console.log(prices);
            data.maxPrice = data.price;
            data.minPrice = data.price;

            data.prices = [data.price];
            data.times = [data.time];
//            data.prices = [{ x: data.time, y: data.price }]

//            allData.push(data);
            let objId;
            // Add item to mongodb database
            mongoClient.connect(uri, (err, client) => {
                if (err) throw err;
                let db = client.db('users');
                console.log(db.collection(username).countDocuments({}));////////////////////////////////////////////////////
                db.collection(username).insertOne(data, (err, result) => {
                    if (err) throw err;
                    objId = result.insertedId;
                    client.close();
                });
            });

            // Update price every ................................................. hours
            let intervalId = setInterval(() => {
                mongoClient.connect(uri, (err, client) => {
                    if (err) throw err;
                    let db = client.db('users');
                    if (db.collection(username).countDocuments({}) == 0) {
                        clearInterval(intervalId);
                    } else {
                        updateCurrentPrice(req.body.url, objId, username);
                    }
                });
                
            }, 10000/*3600000*/);
/*
            mongoClient.connect(uri, (err, client) => {
                if (err) throw err;
                let db = client.db('users');
                db.collection(username + '_update_timers').insertOne({ '_id': objId, 'intervalId': parseFloat(intervalId) },
                                                                     (err, result) => {
                    if (err) throw err;
                    client.close();
                });
            });*/

            res.redirect('/user/' + username);
        });
});


// Updates the price data for a tracked item
const updateCurrentPrice = function(url, objId, username) {
    scraper.getData(url)
        .then((data) => {
            // Insert data to mongodb database
            mongoClient.connect(uri, (err, client) => {
                if (err) throw err;
                let db = client.db('users');
                db.collection(username).updateOne({ '_id': objId }, 
                                                  { $push: { 'prices': data.price, 'times': data.time }, 
//                                                  { $push: { 'prices': { y: data.time, x: data.price } }, 
                                                    $max: { 'maxPrice': data.price }, 
                                                    $min: { 'minPrice': data.price } }, 
                                                  (err, result) => {
                    if (err) throw err;
                    client.close();
                });
            });
        });
};


app.post('/remove-item', (req, res) => {
//    let index = req.body.num;
//    allData.splice(index, 1);
    let username = req.body.username;



    // Remove item from mongodb database
    mongoClient.connect(uri, (err, client) => {
        if (err) throw err;
        let db = client.db('users');
        clearInterval(req.body.id);
        db.collection(username).deleteOne( {'_id': objectId(req.body.id) }, (err, result) => {
            if (err) throw err;
            client.close();
        });
    });
    res.redirect('/user/' + username);
});


// Create and activate server
const server = http.createServer(app);
const port = 3000;
server.listen(process.env.PORT || port, 
    () => console.log('Server is listening on port ' + port));
    
