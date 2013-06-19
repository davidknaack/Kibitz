var express = require('express');
var app = module.exports = express();
var config = require('./config.js')(app, express);

var dataModels = { 
    kibitz: { 
        kibItems: [], 
        add: function(kib){ 
            dataModels.kibitz.kibItems.push(kib);
            var l = dataModels.kibitz.kibItems.length
            if ( l > 5)
                dataModels.kibitz.kibItems = dataModels.kibitz.kibItems.slice(l-5,l);
        }}
};

require('./routes')(app, dataModels);

console.log(process.env.PORT);
app.listen(process.env.PORT);