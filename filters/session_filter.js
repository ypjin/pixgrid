var ACS = require('acs').ACS,
    logger = require('acs').logger

function checkUserSession(req, res, next) {
  req.session.check = function(req, res, callback){
    ACS.Users.showMe(function(e){
      if(e.success && e.success === true){
        var user = e.users[0];
        if(user.first_name && user.last_name) {
          user.name = user.first_name + ' ' + user.last_name;
        } else {
          user.name = user.username;
        }
        req.session.user = user;
      }else{
        req.session.controller = "";
        logger.debug('Error: ' + JSON.stringify(e));
        delete req.session.user;
        req.session.flash = {msg:"Please login first.",r:0};
        res.render('login', {
          layout: 'application',
          req: req
        });
        return;
      }
      callback();
    }, req, res);
  }

  if(req.session.flash && req.session.flash.r == 0){
    req.session.flash.r = 1;
  }else{
    req.session.flash = {};
  }

  if(!req.session.user && req.url !== "/" && req.url !== "/login" && req.url !== "/logout" && req.url !== "/signup"){
    req.session.flash = {msg:"Please login first.",r:0};
    res.render('login', {
      layout: 'application',
      req: req
    });
    return;
  }

  next();
}