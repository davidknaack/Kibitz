var express = require('express');
var app = module.exports = express();
var config = require('./config.js')(app, express);
var jade = require('jade');
var fs = require('fs');

var kibitzDM = function(){  
    var key = 'kibitzs.jade';
    var path = __dirname + '/views/'+key;
    var str = jade.cache[key] || (jade.cache[key] = fs.readFileSync(path, 'utf8'));
    var kibView = jade.compile(str);

    var kibItems = [];
    
    var add = function(user,msg){ 
        kibItems.push({date: 1, from: user, text: msg});
        
        var l = kibItems.length;
        if (l > 5)
            kibItems = kibItems.slice(l-5,l);
    };
    add( 'guest', 'first post');
    
    var getView = function(user){
        return kibView({
            username: user,
            kibItems: kibItems
        });
    };
    
    return {
        getView : getView,
        kibItems : kibItems,
        add : add
    };
}();

app.get('/', function(req, res){
    req.session.username = req.session.username||'guest';
    console.log( 'render : ' + kibitzDM.kibItems);
    res.render('index.jade', {
        username: req.session.username,
        kibItems: kibitzDM.kibItems
    });
});

app.post('/posta', function(req, res){
    req.session.username = req.body.from;
    if (req.body.newtext)
        kibitzDM.add(req.session.username, req.body.newtext);
    io.sockets.emit('kibView', kibitzDM.getView(req.session.username));
    res.send('');
});

console.log(process.env.PORT);
var io = require('socket.io').listen(app.listen(process.env.PORT));
// fall back to ajax long-polling, AppFog doesn't support websockets.
io.set('transports', ['xhr-polling']);
