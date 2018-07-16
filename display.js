display = (function(){
    var model;
    var canvas; 
    var numPixels = 25;
    var padding = 1;
    var cells = [];
    
    function hashCoordinates(coordinate){
        return coordinate.x+ "," + coordinate.y;
    }
    
    function getCell(coordinate){
        
        if(!cells[hashCoordinates(coordinate)]){
            cells[hashCoordinates(coordinate)] = {
                        coordinate: coordinate,
                        color: {r:model.defaultColor, g:model.defaultColor, b:model.defaultColor},
                        alive: false
                    };
        }
        
        return cells[hashCoordinates(coordinate)];
    }
    
    
    (function(){
        setupControllers();
    })();
    
    function setupControllers(){
        
        canvas = document.getElementById("canvas");
        canvas.addEventListener('click', function(evt) 
        {
                var mousePos = getSquare(canvas, evt);
        });
        //console.log(obj); 
        
        $('.next').on('click', function(){
            client.next($('.next').text());
        });
        $('.reset').on('click', function(){ 
            client.size($('.size').val());
        });
        $('.play').on('click', function(){
            if($(this).text() === "play"){
                client.play();
            }else{
                client.pause();
            }
        });
        
        $('.size').on('change', function(){
            client.size($('.size').val());
        });
        
        $('.interval').on('change', function(){
            console.log($('.interval').val());
            client.interval($('.interval').val());
        });
    }
    
    function setPlay(state){
        $('.play').text(state);
    }
    
    
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

            var xSize = o.boardSize.x;
            var ySize = o.boardSize.y;
            
            updateSize(xSize +"x"+ ySize);
            $('.board').attr('width', numPixels * xSize);
            $('.board').attr('height', numPixels * ySize);
            //ctx.fillStyle = 'rgb(' + obj.deadColor.r + ', ' + obj.deadColor.g + ', ' + obj.deadColor.b + ')';

            for (var x=0;x<xSize;x++) //replaced w with boardSize
            {
                    for (var y=0;y<ySize;y++) //replaced h with boardSize
                    {

                            ctx.fillStyle = 'rgb(' + o.defaultColor.r + ', ' + o.defaultColor.g + 
                            ', ' + o.defaultColor.b + ')';
                            ctx.fillRect(x * numPixels, y * numPixels, numPixels - padding, numPixels - padding);
                            //ctx.moveTo(x, 0);
                            //ctx.lineTo(x, h);
                            //ctx.stroke();
                            //ctx.moveTo(0, y);
                            //ctx.lineTo(w, y);
                            //ctx.stroke();
                    }
            }	
            
            $('.generation').text(o.generation);
            
            if(o.living && o.living.length){
                updateBoard(o.living);
            }
    }
    
    function updateBoard(updates){
            var o = model;
            
            var ctx = canvas.getContext('2d');
            
            updates.forEach(function(update){
                var x = update.coordinate.x;
                var y = update.coordinate.y;
                
                cells[hashCoordinates(update.coordinate)] = update;
                
                ctx.fillStyle = 'rgb(' + update.color.r + ', ' + update.color.g + ', ' + update.color.b + ')';
                ctx.fillRect(x * numPixels, y * numPixels, numPixels - padding, numPixels - padding);
                
            });
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
            
            var userColor = model.colorOptions[$(".color").val()];
            
            var cell = getCell({x:x, y:y});
            
            //2. isCellAlive(): if true, set to dead and dead color; else set to alive and user color
            if(cell.alive === false)
            {
                    cell.alive = true;
                    cell.color.r = userColor.r; 
                    cell.color.g = userColor.g; 
                    cell.color.b = userColor.b;
            }
            else
            {
                    cell.alive = false;
                    cell.color.r = model.deadColor.r; 
                    cell.color.g = model.deadColor.g; 
                    cell.color.b = model.deadColor.b;
            }
            
            //3. Notify Server
            client.updateServer(cell);
    }
    
    function updateGeneration(update){
        model.generation = update;
        $('.generation').text(model.generation);
    }
    
    function updateSize(size){
        $(".size").val(size);
    }
    function updateInterval(interval){
        $(".interval").val(interval);
    }

    return {
        paintBoard: paintBoard,
        updateBoard: updateBoard,
        updateGeneration: updateGeneration,
        setPlay: setPlay,
        updateSize: updateSize,
        updateInterval: updateInterval
    };
})();