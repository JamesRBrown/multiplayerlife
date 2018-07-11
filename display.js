(function(){
    var obj;
    var canvas; 
    canvas = document.getElementById("canvas");
    canvas.addEventListener('click', function(evt) 
    {
            var mousePos = getSquare(canvas, evt);
    });
    //console.log(obj); 
    
    $.get( "http://wsu.zenlink.biz/multiplayerlife/turns/newTurn.json", function( data ) 
    {
            //the data variable will contain the data from the url provided
            //in this case it will be the contents of the turn0.json file

            //console.log("This is what the raw data looks like:");
            //console.log(data);

            //that means we need to parse the JSON back into an object

            //console.log(data);

            obj = data;

            


            paintBoard(obj); 

    });

    //Break the paint out of this function, then just repaint board each time something is clicked
    function paintBoard(obj)
    {
            //obj.boardColor.g = 255;
            //canvas = document.getElementById("canvas");
            var ctx = canvas.getContext('2d');
            //console.log(obj.boardColor.r + ', ' + obj.boardColor.g + ', ' + obj.boardColor.b);
            ctx.fillStyle = 'rgb(' + obj.boardColor.r + ', ' + obj.boardColor.g + ', ' + obj.boardColor.b + ')';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            //var w = 400; 
            //var h = 400;

            var xSize = obj.board.length;
            var ySize = obj.board[0].length;
            var numPixels = 25;
            //ctx.fillStyle = 'rgb(' + obj.deadColor.r + ', ' + obj.deadColor.g + ', ' + obj.deadColor.b + ')';

            for (x=0;x<xSize;x++) //replaced w with boardSize
            {
                    for (y=0;y<ySize;y++) //replaced h with boardSize
                    {

                            ctx.fillStyle = 'rgb(' + obj.board[x][y].color.r + ', ' + obj.board[x][y].color.g + 
                            ', ' + obj.board[x][y].color.b + ')';
                            ctx.fillRect(x * numPixels, y * numPixels, 24, 24);
                            //ctx.moveTo(x, 0);
                            //ctx.lineTo(x, h);
                            //ctx.stroke();
                            //ctx.moveTo(0, y);
                            //ctx.lineTo(w, y);
                            //ctx.stroke();
                    }
            }	
    }



    function getSquare(canvas, evt) 
    {
            //1. Where clicked (which array position)
            var rect = canvas.getBoundingClientRect();
            var x = evt.clientX - rect.left;
            var y = evt.clientY - rect.top;
            //alert("Mouse position: " + x + " " + y);
            x /= 25;
            y /= 25;
            //Round values down to get integers
            x = Math.floor(x);
            y = Math.floor(y);

            //2. isCellAlive(): if true, set to dead and dead color; else set to alive and user color
            obj.board[x][y].updated = true; //Server needs to know if cell was updated in any way
            if(obj.board[x][y].live === false)
            {
                    obj.board[x][y].live = true;
                    obj.board[x][y].color.r = obj.userColor.r; 
                    obj.board[x][y].color.g = obj.userColor.g; 
                    obj.board[x][y].color.b = obj.userColor.b;
            }
            else
            {
                    obj.board[x][y].live = false;
                    obj.board[x][y].color.r = obj.deadColor.r; 
                    obj.board[x][y].color.g = obj.deadColor.g; 
                    obj.board[x][y].color.b = obj.deadColor.b;
            }

            //3. Repaint board
            paintBoard(obj); 
            //sendData();
    }


    function sendData()
    {
            var string = JSON.stringify(obj);
            $.post("http://wsu.zenlink.biz/multiplayerlife/turns/newTurn.json", string);
    }

    //function fillSquare(ctx, x, y)
    //{
    //	ctx.fillStyle = 'rgb(' + obj.userColor.r + ', ' + obj.userColor.g + ', ' + obj.userColor.b + ')';
    //	ctx.fillRect(x,y,9,9);
    //}
})();