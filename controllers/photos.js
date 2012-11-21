var ACS = require('acs').ACS,
    logger = require('acs').logger;

function _index(req, res) {
  req.session.check(req, res, function(){
    req.session.controller = "photos";
    var data = {
      per_page:1000,
      order:"-updated_at",
      where:"{\"user_id\":\""+req.session.user.id+"\"}"
    };
    ACS.Photos.query(data, function(e) {
      if(e.success && e.success === true){
        res.render('photos/index', {
          layout: 'layout/application',
          obj: e,
          req: req
        });
      }else{
        req.session.flash = {msg:e.message, r:0};
        res.redirect('/');
        logger.debug('Error: ' + JSON.stringify(e));
      }
    }, req, res);
  });
}

function _show(req, res) {
  req.session.check(req, res, function(){
    req.session.controller = "photos";
    var data = {
      photo_id: req.params.id
    };
    ACS.Photos.show(data, function(e) {
      if(e.success && e.success === true){
        res.render('photos/show', {
          layout: 'layout/application',
          req: req,
          obj: e
        });
      }else{
        req.session.flash = {msg:e.message, r:0};
        res.redirect('/photos');
        logger.debug('Error: ' + JSON.stringify(e));
      }
    }, req, res);
  });
}

function _new(req, res) {
  req.session.check(req, res, function(){
    req.session.controller = "photos";
    res.render('photos/new', {
      req: req,
      layout: 'layout/application'
    });
  });
}

function _create(req, res) {
  req.session.check(req, res, function(){
    req.session.controller = "photos";
    var data = {
      photo: req.files.photo,
      collection_id: req.body.collection_id,
      tags: req.body.tags
    };
    ACS.Photos.create(data, function(e) {
      if(e.success && e.success === true){
        logger.info('photos#create: ' + JSON.stringify(e));
        req.session.flash = {msg:"Successfully create a photo #"+e.photos[0].id, r:0};
        res.redirect('/photos');
      }else{
        logger.debug('Error: ' + JSON.stringify(e));
        req.session.flash = {msg:e.message, r:0};
        res.redirect('/photos/new');
      }
    }, req, res);
  });
}

function _edit(req, res) {
  req.session.check(req, res, function(){
    req.session.controller = "photos";
    var data = {
      photo_id: req.params.id
    };
    ACS.Photos.show(data, function(e) {
      if(e.success && e.success === true){
        res.render('photos/edit', {
          layout: 'layout/application',
          req: req,
          obj: e
        });
      }else{
        logger.debug('Error: ' + JSON.stringify(e));
        req.session.flash = {msg:e.message, r:0};
        res.redirect('/photos');
      }
    }, req, res);
  });
}

function _update(req, res) {
  req.session.check(req, res, function(){
    req.session.controller = "photos";
    if(req.files.photo.name !== ""){
      var data = {
        photo_id: req.params.id,
        photo: req.files.photo,
        collection_id: req.body.collection_id,
        tags: req.body.tags
      };
    }else{
      var data = {
        photo_id: req.params.id,
        collection_id: req.body.collection_id,
        tags: req.body.tags
      };
    }
    logger.debug(JSON.stringify(data));
    ACS.Photos.update(data, function(e) {
      if(e.success && e.success === true){
        logger.info('photos#update: ' + JSON.stringify(e));
        req.session.flash = {msg:"Successfully update a photo #"+e.photos[0].id+", photo update could take couple seconds.", r:0};
        res.redirect('/photos');
      }else{
        logger.debug('Error: ' + JSON.stringify(e));
        req.session.flash = {msg:e.message, r:0};
        res.redirect('/photos/'+req.params.id+'/edit');
      }
    }, req, res);
  });
}

function _destroy(req, res) {
  req.session.check(req, res, function(){
    req.session.controller = "photos";
    var data = {
      photo_id: req.params.id
    };
    ACS.Photos.remove(data, function(e) {
      if(e.success && e.success === true){
        logger.info('photos#destroy: ' + JSON.stringify(e));
        req.session.flash = {msg:"Successfully delete a photo #"+req.params.id, r:0};
        res.redirect('/photos');
      }else{
        logger.debug('Error: ' + JSON.stringify(e));
        req.session.flash = {msg:e.message, r:0};
        res.redirect('/photos');
      }
    }, req, res);
  });
}