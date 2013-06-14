module.exports = function(app, dataModels){
 
    /**
     *  Index
    */
    app.get('/', function(req, res){
        if (app.requireAuth === true && req.loggedIn === false)
            res.redirect('/auth/twitter');

        res.render('index.jade', {
            title: 'Test index page',
            page: 'index',
            kibItems: dataModels.kibitz.kibItems
        });
    });
  
  
  /**
   *  Add test doc
   */
  app.post('/posts', function(req, res){
      console.log(req.body);
     dataModels.kibitz.kibItems.push({date: 1, from: req.body['from'], text: req.body['newtext']});
     res.redirect('/');
  });
  
};