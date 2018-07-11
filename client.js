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
    
    (function(){
        ws = connect();
    })();
    
    function rxMessagesProcessor(o){
        
        if(o.message === "model"){
            display.paintBoard(o.model)
        }
        if(o.message === "updates"){
            var model;
            o.updates.forEach(function(update){
                model = display.updateModel(update);
            });
            display.paintBoard(model);
        }
            
    }
    
    var send = {
        update: function(update){
            ws.send(JSON.stringify({
                message: "update",
                update: update
            }));
        },
        modelRequest: function(){
            ws.send(JSON.stringify({
                message: "model"
            }));
        }
    };
    
    return {
        reconnect: function(){
            ws = connect();
        },
        getResponse: function(){
            return responses;
        },
        updateServer: send.update
    };
})();