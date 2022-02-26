const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';

const express = require('express');
const app = express();

app.use( express.json());
app.use(express.urlencoded());

const PORT = 3000;

//database connection
let db;
MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, client) => {
    if (err) {
        return console.log(err);
    }
    db = client.db('TicTacToe');
    console.log(`MongoDB Connected: ${url}`);
});


app.post('/adduser', (req, res) => {
    const users = db.collection('users');

    users.insertOne(req.body)
    .then(result => {
        console.log(result);
    })
    .catch(err => {
        res.status(404).send({
            "status": "ERROR"
        })
        console.log(err);
    });

    res.status(200).send({
        "status": "OK"
    })
});

app.post('/login', (req, res) => {
    const users = db.collection('users');

    users.findOne({username: req.body.username})
    .then(result => {
        if(result == null){
            res.status(404).send({
                "status": "ERROR"
            })
        }
        console.log(result);
    })
    .catch(err => {
        res.status(404).send({
            "status": "ERROR"
        })
        console.log(err);
    });

});




app.post('/ttt/play', (req, res) => {
    const{grid} = req.body;
    let playerWin = "";
    
    //check grid for winner
    if(grid[0] === grid[1] && grid[0] === grid[2]){
        if(!playerWin) playerWin = grid[0];
    }
    if(grid[3] === grid[4] && grid[3] === grid[5]){
        if(!playerWin) playerWin = grid[3];
    }
    if(grid[6] === grid[7] && grid[6] === grid[8]){
        if(!playerWin) playerWin = grid[6];
    }
    if(grid[0] === grid[3] && grid[0] === grid[6]){
        if(!playerWin) playerWin = grid[0];
    }
    if(grid[1] === grid[4] && grid[1] === grid[7]){
        if(!playerWin) playerWin = grid[1];
    }
    if(grid[2] === grid[5] && grid[2] === grid[8]){
        if(!playerWin) playerWin = grid[2];
    }
    if(grid[0] === grid[4] && grid[0] === grid[8]){
        if(!playerWin) playerWin = grid[0];
    }
    if(grid[2] === grid[4] && grid[2] === grid[6]){
        if(!playerWin) playerWin = grid[2];
    }
    
    res.status(200).send({
        grid: grid,
        winner: playerWin
    })
});

app.listen(PORT, () => console.log('Website is live'))
