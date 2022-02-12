const express = require('express');
const app = express();

app.use( express.json());
app.use(express.urlencoded());
app.use(express.static('/var/www/loner.cse356.compas.cs.stonybrook.edu/'));
app.set('view engine', 'pug');

const PORT = 3000;


app.post('/ttt/', (req, res) => {
    console.log(req.body.name);
    const date = new Date();
    res.render('index', { message: "Hello " + req.body.name + ", " + date});
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
