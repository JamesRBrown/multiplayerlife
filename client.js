client = (function(){
    
    var ws = {};
    var responses = [];
    
    function connect(){
        var ws = new WebSocket('ws://wsu.zenlink.biz:3000');

        ws.onopen = function () {
            console.log('websocket is connected ...');
            ws.send(JSON.stringify({message: "connected"}));
            send.modelRequest();
        };

        responses = [];
        ws.onmessage = function (ev) {
            var data = JSON.parse(ev.data);
            data = JSON.parse(data);
            responses.push(data);
            console.log(ev);
            console.log(data);
            rxMessagesProcessor(data);
        };
        
        return ws;
    }
    function reconnect(){
        ws = connect();
    }
    
    (function(){
        reconnect();
    })();
    
    
    
    function rxMessagesProcessor(o){
        
        if(o.message === "model"){
            display.paintBoard(o.model)
        }
        if(o.message === "updates"){
            display.updateBoard(o.updates);
        }
        if(o.message === "play"){
            display.setPlay("pause");
        }
        if(o.message === "pause"){
            display.setPlay("play");
        }
        if(o.message === "interval"){
            
        }
        if(o.message === "generation"){
            display.updateGeneration(o.generation);
        }
        if(o.message === "size"){
            display.updateSize(o.size);
        }
        if(o.message === "interval"){
            display.updateInterval(o.interval);
        }
            
    }
    
    var send = {
        send: function(data){
            if(ws.readyState === ws.CLOSED){
                reconnect();  
            }else{
                ws.send(data);
            }
        }, 
        update: function(update){
            send.send(JSON.stringify({
                message: "update",
                update: update
            }));
        },
        modelRequest: function(){
            send.send(JSON.stringify({
                message: "model"
            }));
        },
        play: function(){
            send.send(JSON.stringify({
                message: "play"
            }));
        },
        pause: function(){
            send.send(JSON.stringify({
                message: "pause"
            }));
        },
        size: function(size){
            send.send(JSON.stringify({
                message: "size",
                size: size
            }));
        },
        interval: function(interval){
            send.send(JSON.stringify({
                message: "interval",
                interval: interval
            }));
        },
        next: function(interval){
            send.send(JSON.stringify({
                message: "nextTick"
            }));
        }
    };
    
    return {
        reconnect: reconnect,
        getResponse: function(){
            return responses;
        },
        updateServer: send.update,
        play: send.play,
        pause: send.pause,
        size: send.size,
        interval: send.interval,
        next: send.next
    };
})();