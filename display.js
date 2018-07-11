display = (function(){
    var obj;
    var model;
    var canvas; 
    canvas = document.getElementById("canvas");
    canvas.addEventListener('click', function(evt) 
    {
            var mousePos = getSquare(canvas, evt);
    });
    //console.log(obj); 
    

    //Break the paint out of this function, then just repaint board each time something is clicked
    function paintBoard(o)
    {
            model = o;
            //obj.boardColor.g = 255;
            //canvas = document.getElementById("canvas");
            var ctx = canvas.getContext('2d');
            //console.log(obj.boardColor.r + ', ' + obj.boardColor.g + ', ' + obj.boardColor.b);
            ctx.fillStyle = 'rgb(' + o.boardColor.r + ', ' + o.boardColor.g + ', ' + o.boardColor.b + ')';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            //var w = 400; 
            //var h = 400;

            var xSize = o.board.length;
            var ySize = o.board[0].length;
            var numPixels = 25;
            //ctx.fillStyle = 'rgb(' + obj.deadColor.r + ', ' + obj.deadColor.g + ', ' + obj.deadColor.b + ')';

            for (x=0;x<xSize;x++) //replaced w with boardSize
            {
                    for (y=0;y<ySize;y++) //replaced h with boardSize
                    {

                            ctx.fillStyle = 'rgb(' + o.board[x][y].color.r + ', ' + o.board[x][y].color.g + 
                            ', ' + o.board[x][y].color.b + ')';
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
            model.board[x][y].updated = true; //Server needs to know if cell was updated in any way
            if(model.board[x][y].alive === false)
            {
                    model.board[x][y].alive = true;
                    model.board[x][y].color.r = model.userColor.r; 
                    model.board[x][y].color.g = model.userColor.g; 
                    model.board[x][y].color.b = model.userColor.b;
            }
            else
            {
                    model.board[x][y].alive = false;
                    model.board[x][y].color.r = model.deadColor.r; 
                    model.board[x][y].color.g = model.deadColor.g; 
                    model.board[x][y].color.b = model.deadColor.b;
            }
            
            //3. Repaint board
            paintBoard(model); 
            //sendData();
            
            //4. Notify Server
            var update = {
                coordinate: {x:x, y:y},
                color: {
                    r:model.board[x][y].color.r, 
                    g:model.board[x][y].color.g, 
                    b:model.board[x][y].color.b
                },
                alive:  model.board[x][y].alive
            };
            client.updateServer(update);
    }
    
    function updateModel(update){
        model.board[update.coordinate.x][update.coordinate.y].alive = update.alive;
        model.board[update.coordinate.x][update.coordinate.y].color = {
            r: update.color.r,
            g: update.color.g,
            b: update.color.b
        };
        
        return model;
    }

    return {
        paintBoard: paintBoard,
        updateModel: updateModel
    };
})();