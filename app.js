var express = require('express');
var app = module.exports = express();
var config = require('./config.js')(app, express);

var kibitzModel = function(){
    var id = 0;
    var kibItems = [];
    var listeners = [];
    var get = function(){
        return kibItems;
    };
    var getLastId = function(){
        if ( kibItems.length === 0 )
            return 0;
        return kibItems[kibItems.length-1].id;
    }
    var add = function(nick, message){
        id++;
        kibItems.push({id:id, nick:nick, message:message});
        
        var l = kibItems.length;
        if ( l > 5 )
            kibItems = kibItems.slice(l - 5, l);
        
        // Send each listener all the kibItems
        listeners.forEach(function(l){l();});
        listeners = [];
    };
    var listen = function(l){
        listeners.push(l);
    };
    
    // Return public methods
    return {
        get: get,
        add: add,
        listen: listen,
        getLastId: getLastId
    };
}();

app.get('/chatlog/:lastId', function(req, res){
    var done = false;
    var finish = function(){
        if (!done) res.send(kibitzModel.get());
        done= true;
    };
    
    if ( req.params.lastId < kibitzModel.getLastId() ) {
        // If client doesn't have the latest ID, just finish.
        finish();
    } else {
        // If client does, wait 30 seconds or until a message is sent.
        setTimeout(finish, 30000);
        kibitzModel.listen(finish);
    }
});

app.post('/send', function(req, res){
    req.session.username = req.body.nick;
    if (req.body.message)
        kibitzModel.add(req.body.nick, req.body.message);
        
    // Send an empty response. We don't poll the chat log from here.
    res.send("");
});

console.log(process.env.PORT);
app.listen(process.env.PORT);