(function(){
    
    var ws = {};
    var responses = [];
    
    function connect(){
        var ws = new WebSocket('ws://wsu.zenlink.biz:3000');

        ws.onopen = function () {
            console.log('websocket is connected ...');
            ws.send(JSON.stringify({message: "connected"}));
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
    
    function rxMessagesProcessor(message){
        
        
    }
    
    return {
        reconnect: function(){
            ws = connect();
        },
        getResponse: function(){
            return responses;
        }
    };
})();