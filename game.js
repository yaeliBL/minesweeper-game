// this function defines the level of tha game.
function banay(b, r,c){

    var click = document.getElementById('click');
    click.play();
    minesCount =b;
    rows = r;
    col = c; 
    document.querySelector(".popup").style.display = "none";
    audio = document.getElementById('audio');
    playPauseButton = document.getElementById('playPauseButton');
    isOn = 0; 
   playPause();
}
// this function saves the name. (if recived..)
function n(){
    name = document.getElementById("name1").value;
}
var board =[];
var minesLocation = [];
var tilesClicked = 0;
var gameOver = false;

// cancel the default of the right click.
window.oncontextmenu = function () {
    console.log("Right Click Disabled");
    return false;
}

// random the mines location
function setMines(){
    let minesLeft = minesCount;
    while(minesLeft > 0){
        let r = Math.floor(Math.random()*rows);
        let c = Math.floor(Math.random()*col);
        let id = r.toString() + "-" + c.toString();
        if(!minesLocation.includes(id)){
            minesLocation.push(id);
            minesLeft--;
        }
    }
}

// activates the game
function startGame(b, r,c){


    banay(b, r,c);

    //rules POPUP 
document.querySelector("#close").addEventListener("click",
function(){
   document.querySelector(".popR").style.display = "none";
}
);

document.querySelector("#r2").addEventListener("click",
function(){
   document.querySelector(".popR").style.display = "block";
}
);

    document.getElementById("mines-count").innerText = minesCount; //write the current number of mines
    // define the board size according to the selected level
    document.getElementById("board").style.width=rows*50+"px";
    document.getElementById("board").style.height=rows*50+"px"   
    setMines(); // random thr mines
    //create the board by create a div,and add click event.
    for(let i = 0; i < rows ;i++){
        let row = [];
        for(let j =0; j<col;j++){
            let tile = document.createElement("div");
            tile.id = i.toString() + "-" + j.toString();
            tile.addEventListener("click", clickTile);
            tile.addEventListener("contextmenu", clickright);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
    console.log(board);
}

// right click operation: remove/add flag
function clickright(){
    let tile = this; 
    if(tile.innerText =="" && !gameOver){
        tile.innerText = "🚩";
        document.getElementById("mines-count").innerText--;
    }
    else if(tile.innerText == "🚩"){
        tile.innerText ="";
        document.getElementById("mines-count").innerText++;
    }
}

// this function is called as clicking on a tile.
function clickTile(){
    if(gameOver || this.classList.contains("tile-clicked")){
        return;
    }
    if(this.innerText ==""){
     let tile = this;
     if(minesLocation.includes(tile.id)){
         gameOver=true;
         revealMines();
         return;
     }
     let coords=tile.id.split("-");
     let r = parseInt(coords[0]);
     let c = parseInt(coords[1]);
     checkMine(r, c);
    }
    var click = document.getElementById('click');
    click.play();
}

// reveals all the mines. (in case of failure)
function revealMines(){
    var boom = document.getElementById('boom');
    boom.play();
    for(let i=0;i<rows;i++){
        for(let j=0;j<col;j++){
            let tile=board[i][j];
            if(minesLocation.includes(tile.id)){
                tile.innerText="💣";
                tile.style.backgroundColor="red";
            }
        }
    }
    document.querySelector(".over").style.display = "block";
    document.getElementById("win").innerText =`${name}
    What  a looser👎👎`;
    setTimeout(
        function open(event){
            document.querySelector(".over").style.display = "none";
            document.querySelector(".end").style.display = "block";
            var looser = document.getElementById('loose');
            looser.play();

        },2000)
}

// recursive function, who gets a location on the board and reveals the number of mines around it.
function checkMine(i, j){
    if(i<0  || i>= rows || j<0 || j>= col)
        return;
    if(board[i][j].classList.contains("tile-clicked"))
        return;
    board[i][j].classList.add("tile-clicked");
    tilesClicked++;

    let minesFound = 0;
    //top 3
    minesFound+= checkTile(i-1,j);
    minesFound+= checkTile(i-1, j-1);
    minesFound+= checkTile(i-1, j+1);
    //left & right
    minesFound+= checkTile(i, j-1);
    minesFound+= checkTile(i, j+1);
    //down 3
    minesFound+= checkTile(i+1, j-1);
    minesFound+= checkTile(i+1, j);
    minesFound+= checkTile(i+1, j+1);
    if(minesFound>0){
        board[i][j].innerText = minesFound;
        board[i][j].classList.add("x"+minesFound.toString());
    }
    else{
        checkMine(i-1,j-1)
        checkMine(i-1,j)
        checkMine(i-1,j+1)
        checkMine(i,j-1)
        checkMine(i,j+1)
        checkMine(i+1,j-1)
        checkMine(i+1,j)
        checkMine(i+1,j+1)
    }
    //in case we won
   if(tilesClicked==rows*col-minesCount){
      document.getElementById("mines-count").innerText="Cleared";
      gameOver=true;
      document.getElementById("win").innerText =`${name}
      congreatulations!!!  you won!`;

//confetti
      var end = Date.now() + (15 * 1000);
var colors = ['#bb0000', '#ffffff'];
(function frame() {
  confetti({
    particleCount: 2,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors: colors
  });
  confetti({
    particleCount: 2,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors: colors
  })
  if (Date.now() < end) {
    requestAnimationFrame(frame);
  }
}());

      setTimeout(
          function open(event){
              document.querySelector(".end").style.display = "block";
              var clap = document.getElementById('clap');
              clap.play();
          },2000)
   }
}


function checkTile(i, j){
    if(i<0 || i>= rows || j<0 || j>= col)//in case the location is OOB. (out of bound)
       return 0;      
    if(minesLocation.includes(i.toString()+"-"+j.toString()))
      return 1;
    return 0;
}

// play/ stop the background music
function playPause(){
    console.log(isOn);
    if(isOn == 0) 
    {
        isOn = 1;
        audio.play();
        playPauseButton.innerHTML ="&#128266;";  //or the icon &#9658;         
    }
    else
    {
        isOn = 0;
        audio.pause();
        playPauseButton.innerHTML ="&#128264;" //  or the icon &#9628;

    }

}