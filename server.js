const http = require('http');
const express = require('express');
const scraper = require('./scraper');
const mongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectId;

require('dotenv').config();

const app = express();

// Server can locate static resources from given root directory
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

const uri = process.env.MONGODB_URI;

// Server receives requests to access the page and then loads the page
app.get('/:failed?', (req, res) => {
    res.render('home', { failed: req.params.failed });
});

// Gets username and redirects to specified user's page
app.post('/goto-user', (req, res) => {
    res.redirect('/user/' + req.body.username);
});

// Checks if the entered username already exists
app.post('/create-user', (req, res) => {
    let username = req.body.username;

    mongoClient.connect(uri, (err, client) => {
        if (err) throw err;
        let db = client.db('users');

        // Create database collection for specified username
        db.listCollections({ name: username })
            .next((err, info) => {
                client.close();
                if (info) {
                    res.redirect('/1');
                } else {
                    res.redirect('/user/' + username);
                }
            });
    });
});

// Server loads all the data in the specified user's page
app.get('/user/:username/:failed?', (req, res) => {
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
            res.render('user-home', { allData: resultArray, name: username, failed: req.params.failed });
        });
    });
})

// Server receives initial data when user submits a url and adds it to database
app.post('/add-item-url', (req, res) => {
    let username = req.body.username;

    scraper.getData(req.body.url)
        .then(data => {
            data.maxPrice = data.price;
            data.minPrice = data.price;
            data.prices = [data.price];
            data.times = [data.time];

            // Add item to mongodb database
            let objId;
            mongoClient.connect(uri, (err, client) => {
                if (err) throw err;
                let db = client.db('users');
                db.collection(username).insertOne(data, (err, result) => {
                    if (err) throw err;
                    objId = result.insertedId;
                    client.close();
                });
            });

            // Update price every 12 hours
            let intervalId = setInterval(() => {
                mongoClient.connect(uri, (err, client) => {
                    if (err) throw err;
                    let db = client.db('users');
                    db.collection(username).countDocuments({ _id: objId })
                        .then(count => {
                            if (count == 0) {
                                clearInterval(intervalId);
                            } else {
                                updateCurrentPrice(req.body.url, objId, username);
                            }
                        });
                }); 
            }, 43200000);
            res.redirect('/user/' + username);
        })
        .catch((err) => {
            console.log('Error Detected: ' + err);
            res.redirect('/user/' + username + '/1');
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
                db.collection(username).updateOne({ _id: objId }, 
                                                  { $push: { prices: data.price, times: data.time }, 
                                                    $max: { maxPrice: data.price }, 
                                                    $min: { minPrice: data.price },
                                                    $set: { price: data.price } },
                                                  (err, result) => {
                    if (err) throw err;
                    client.close();
                });
            });
        })
        .catch((err) => {
            console.log('Error Detected: ' + err);
            console.log('Unable to update ' + username + ': ' + url);
        });
};

// Server removes the specified item from the user's page
app.post('/remove-item', (req, res) => {
    let username = req.body.username;
    
    // Remove item from mongodb database
    mongoClient.connect(uri, (err, client) => {
        if (err) throw err;
        let db = client.db('users');
        clearInterval(req.body.id);
        db.collection(username).deleteOne({ _id: objectId(req.body.id) }, (err, result) => {
            if (err) throw err;
            client.close();
        });
    });
    res.redirect('/user/' + username);
});


// Create and activate local server
const server = http.createServer(app);
const port = 3000;
server.listen(process.env.PORT || port, 
    () => console.log('Server is listening on port ' + port));
    

// Update prices each time Heroku dynos restart (24 hour intervals)
// or website is opened.
// Because free dynos on Heroku sleep after a set period of time.
mongoClient.connect(uri, (err, client) => {
    if (err) throw err;
    let db = client.db('users');
    db.listCollections({}, { nameOnly: true }).toArray((err, collInfos) => {
        if (err) throw err;
        collInfos.forEach((collInfo) => {
            let username = collInfo.name;
            db.collection(username).countDocuments()
                .then(count => {
                    if (count != 0) {
                        let cursor = db.collection(username).find();
                        cursor.forEach((doc, err) => {
                            if (err) throw err;
                            console.log(doc.url);
                            console.log(username);
                            console.log(doc._id);
                            console.log(objectId(doc._id));
                            updateCurrentPrice(doc.url, doc._id, username);
                        });
                    }
            });
        }, () => {
            client.close();
        });
    });
});
