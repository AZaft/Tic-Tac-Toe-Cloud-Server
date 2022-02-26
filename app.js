let player = "O";
let grid = ["", "", "", "", "", "", "", "", ""];


function handleClick(event){
    let index = event.target.id.substring(4);
    
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
            console.log("Play res: " + this.responseText);
        };
        sendGrid.send(JSON.stringify({
            "grid": grid
        }));
    }
}

function handleSignup(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let email = document.getElementById("email").value;
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("email").value = "";

    var sendUser = new XMLHttpRequest();
    sendUser.open("POST", "/adduser", true);
    sendUser.setRequestHeader('Content-Type', 'application/json');
    sendUser.onload = function(){
        console.log("Signin res: " + this.responseText);
    };
    sendUser.send(JSON.stringify({
        "username": username,
        "password": password,
        "email": email
    }));
}

function handleLogin(){
    let username = document.getElementById("username2").value;
    let password = document.getElementById("password2").value;
    document.getElementById("username2").value = "";
    document.getElementById("password2").value = "";

    var sendUser = new XMLHttpRequest();
    sendUser.open("POST", "/login", true);
    sendUser.setRequestHeader('Content-Type', 'application/json');
    sendUser.onload = function(){
        console.log("Signin res: " + this.responseText);
    };
    sendUser.send(JSON.stringify({
        "username": username,
        "password": password
    }));
}
