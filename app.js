let player = "O";
let grid = ["", "", "", "", "", "", "", "", ""];


function handleClick(event){
    let index = event.target.id.substring(4);
    console.log(index);

    if(event.target.innerHTML === ""){
        if(player === "O"){
            event.target.innerHTML = player;
            grid[index] = player;
            player = "X"
            
        } else {
            event.target.innerHTML = player;
            grid[index] = player;
            player = "O"
        }

        //bot play
        for(let i = 0; i < grid.length;i++){
            if(grid[i] === ""){
                if(player === "O"){
                    document.getElementById("cell" + i).innerHTML = player;
                    grid[i] = player;
                    player = "X";
                } else {
                    document.getElementById("cell" + i).innerHTML = player;
                    grid[i] = player;
                    player = "O";
                }
                break;
            } 
        }

        var sendGrid = new XMLHttpRequest();
        sendGrid.open("POST", "/ttt/play", true);
        sendGrid.setRequestHeader('Content-Type', 'application/json');
        sendGrid.onload = function(){
            console.log(this.responseText);
        };
        sendGrid.send(JSON.stringify({
            "grid": grid
        }));
    }
}
