var express = require('express');
var app = module.exports = express();
var config = require('./config.js')(app, express);

var dataModels = {  
    kibitz: { 
        kibItems: [], 
        add: function(kib){ 
            dataModels.kibitz.kibItems.push(kib);
            var l = dataModels.kibitz.kibItems.length;
            if ( l > 5)
                dataModels.kibitz.kibItems = dataModels.kibitz.kibItems.slice(l-5,l);
        }}
};

app.get('/', function(req, res){
    req.session.username = req.session.username||'guest';
    res.render('index.jade', {
        title: 'OMG Kibitz',
        username: req.session.username,
        kibItems: dataModels.kibitz.kibItems
    });
});

app.post('/posta', function(req, res){
    console.log(req.body);

    req.session.username = req.body.from;
    
    if (req.body.newtext)
        dataModels.kibitz.add({date: 1, from: req.session.username, text: req.body.newtext});
    
    res.render('kibitzs.jade', {
        kibItems: dataModels.kibitz.kibItems
    });
});

console.log(process.env.PORT);
app.listen(process.env.PORT);