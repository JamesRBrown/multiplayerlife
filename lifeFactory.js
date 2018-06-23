var turnFactory = function(o){
    o = o || {};
    o.callback = o.callback || function(){ console.log("No callback provided!");};
    o.xSize = o.xSize || 16;
    o.ySize = o.ySize || 16;
    o.cell = o.cell || {};
    
    o.cell.live = false;
    o.cell.updated = false;
    o.cell.color = colorFactory();
    
    function colorFactory(){
        return {
            r: 0,
            g: 0,
            b: 0
        };
    }
    
    function boardFactory(o){
        o = o || {};
        o.callback = o.callback || function(){ console.log("No callback provided!");};
        o.xSize = o.xSize || 0;
        o.ySize = o.ySize || 0;
        o.cell = o.cell || {};
        
        var yFactory = function(size, cell){
            
            var y = [];
            
            
            var getObj = (function(o){                
                return {
                    get: function (){
                            return o;
                        }
                }; 
            })(cell);
            
            for(var i = 0; i < size; i++){
                y.push(getObj.get());
            }
            
            return {
                get: function (){
                    return y;
                }
            };
        };
        
        var y = yFactory(o.ySize,  o.cell);
        
        var x = [];
        
        for(var i = 0; i < o.xSize; i++){
            x.push(y.get());
        }
        
        return {
            get:function (){
                    return x;
                }
        };
    }
    
    var board = boardFactory({
        xSize: o.xSize,
        ySize: o.ySize,
        cell: o.cell,
        callback: o.callback
    });
    
    var b = board.get();
    
    function getTurn(){
        return {
            turnID: 0,
            gameID: 0,
            board: b,
            userID: 0,
            userColor: colorFactory(),
            boardColor: colorFactory()
        };
    };
    
    return {
        get: function(){
            return JSON.parse(JSON.stringify(getTurn()));
        }
    };
    
};

