var express = require('express');
var app = module.exports = express();
var config = require('./config.js')(app, express);

var dataModels = { 
    kibitz: { kibItems: [{date: 1, from: 'nobody', text: 'empty'}] }
};

require('./routes')(app, dataModels);

console.log(process.env.PORT);
app.listen(process.env.PORT);