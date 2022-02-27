const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';

const express = require('express');
const cookieSession = require('cookie-session');
const app = express();

app.use( express.json());
app.use(express.urlencoded());

app.use(cookieSession({
  name: 'session',
  keys: ["key1", "key2"],

  // Cookie Options
  maxAge: 60 * 60 * 1000 // 1 hour
}))

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

    let user = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        disabled: true
    }

    //users.findOne({username: req.body.username})

    users.insertOne(user)
    .then(result => {
        console.log(result);
    })
    .catch(err => {
        res.send({
            status: "ERROR"
        })
        console.log(err);
    });

    res.send({
        status: "OK"
    })
});

app.post('/login', (req, res) => {
    const users = db.collection('users');

    users.findOne({username: req.body.username})
    .then(result => {
        if(result == null || result.disabled || result.password !== req.body.password){
            res.send({
                status: "ERROR"
            })
            console.log("Login Failed");
        } else {
            req.session.username = req.body.username
            req.session.grid = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
            res.send({
                status: "OK"
            })
            console.log("Login Success");
        }
        console.log(result);
    })
    .catch(err => {
        res.send({
            status: "ERROR"
        })
        console.log(err);
    });

});

app.post('/logout', (req, res) => {
    req.session = null;
    console.log("Logged out");
    res.send({
        status: "OK"
    });
});

app.post('/verify', (req, res) => {

    const users = db.collection('users');
    users.findOne({email: req.body.email})
    .then(result => {
        if(result == null  || req.body.key !== 'abracadabra' || result.email == null){
            res.send({
                status: "ERROR"
            })
            console.log("Invalid key");
        } else {
            users.updateOne({email: req.body.email}, {$set: {disabled: false}}, {upsert: true})
                .then(result => {
                    console.log("Verified");
                    res.send({
                        status: "OK"
                    })
                });
        }
        console.log(result);
    })
    .catch(err => {
        res.send({
            status: "ERROR"
        })
        console.log(err);
    });
});


app.post('/ttt/play', (req, res) => {
    if(req.session.grid == null){
        res.send({
            status: "ERROR",
        })
        return;
    }
    console.log(req.body);

    const{move} = req.body;
    let grid = req.session.grid;
    let playerWin = " ";
    let tie;

    if(move == null){
        res.send({
            grid: grid,
        })
        return;
    }

    if(grid[move] === " ") grid[move] = 'X';

    playerWin = checkWinner(playerWin, grid);

    //bot move
    for(let i = 0; i < grid.length;i++){
        if(grid[i] === " "){
            grid[i] = 'O';
            break;
        } 
    }

    playerWin = checkWinner(playerWin, grid);


    if(playerWin !== " "){
        req.session.grid = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    
        const games = db.collection('games');

        games.count()
        .then(result => {
                let game = {
                    "id": result + 1,
                    "start_date": new Date(),
                    "grid": grid,
                    "winner": playerWin
                };

                games.insertOne(game)
                .then(result => {
                    res.send({
                        status: "OK",
                        grid: req.session.grid,
                        winner: playerWin
                    })
                    console.log(result);
                    
                    updateScore(playerWin);
                })
        });
    } else {
        console.log(grid);
        res.send({
            status: "OK",
            grid: grid,
            winner: playerWin
        })
    }
});

function updateScore(playerWin) {
    const games = db.collection('games');

    games.findOne({score: true})
    .then(result => {
        if(result == null){
            games.insertOne({score: true, human: 0, wopr: 0, tie: 0})
            if(playerWin === "X"){
                games.updateOne({score: true}, {$inc: {human: 1}})
            } else if(playerWin === "O"){
                games.updateOne({score: true}, {$inc: {wopr: 1}})
            } else if(playerWin === "tie"){
                games.updateOne({score: true}, {$inc: {tie: 1}})
            }
        } else {
            if(playerWin === "X"){
                games.updateOne({score: true}, {$inc: {human: 1}})
            } else if(playerWin === "O"){
                games.updateOne({score: true}, {$inc: {wopr: 1}})
            } else if(playerWin === "tie"){
                games.updateOne({score: true}, {$inc: {tie: 1}})
            }
        }
    })
}

app.post('/listgames', (req, res) => {
    if(req.session == null){
        res.send({
            status: "ERROR",
        })
        return;
    }


    console.log("listgames called");

    const games = db.collection('games');

    games.find({id: {$exists: true}}).toArray()
    .then(result => {
        if(result == null || result === []){
            res.send({
                status: "ERROR"
            })
        } else {
            res.send({
                status: "OK",
                games: result
            })
        }
        console.log(result);
    });
    
});

app.post('/getgame', (req, res) => {
    if(req.session == null){
        res.send({
            status: "ERROR",
        })
        return;
    }


    const games = db.collection('games');
    games.findOne({id: req.body.id})
    .then(result => {
        if(result == null){
            res.send({
                status: "ERROR"
            })
        } else {
            res.send({
                status: "OK",
                grid: result.grid,
                winner: result.winner
            })
        }
        console.log(result);
    });
});

app.post('/getscore', (req, res) => {
    if(req.session == null){
        res.send({
            status: "ERROR",
        })
        return;
    }

    const games = db.collection('games');
    games.findOne({score: true})
    .then(result => {
        if(result == null){
            res.send({
                status: "ERROR"
            })
        } else {
            res.send({
                status: "OK",
                human: result.human,
                wopr: result.wopr,
                tie: result.tie
            })
        }
        console.log(result);
    });
});

function checkWinner(playerWin, grid){
        //check grid for winner
    if(grid[0] === grid[1] && grid[0] === grid[2]){
        if(playerWin === " ") playerWin = grid[0];
    }
    if(grid[3] === grid[4] && grid[3] === grid[5]){
        if(playerWin === " ") playerWin = grid[3];
    }
    if(grid[6] === grid[7] && grid[6] === grid[8]){
        if(playerWin === " ") playerWin = grid[6];
    }
    if(grid[0] === grid[3] && grid[0] === grid[6]){
        if(playerWin === " ") playerWin = grid[0];
    }
    if(grid[1] === grid[4] && grid[1] === grid[7]){
        if(playerWin === " ") playerWin = grid[1];
    }
    if(grid[2] === grid[5] && grid[2] === grid[8]){
        if(playerWin === " ") playerWin = grid[2];
    }
    if(grid[0] === grid[4] && grid[0] === grid[8]){
        if(playerWin === " ") playerWin = grid[0];
    }
    if(grid[2] === grid[4] && grid[2] === grid[6]){
        if(playerWin === " ") playerWin = grid[2];
    }

    if(playerWin === " "){
        tie = true;
        for(let i = 0; i < grid.length;i++){
            if(grid[i] === " "){
                tie = false;
                break;
            }
        }
        if(tie) playerWin = "tie";
    }

    return playerWin;
}

app.listen(PORT, () => console.log('Website is live'))
