module.exports = function(app, dataModels){
 
    app.get('/', function(req, res){
        if (app.requireAuth === true && req.loggedIn === false)
            res.redirect('/auth/twitter');

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

};