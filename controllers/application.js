var ACS = require('acs').ACS,
    logger = require('acs').logger

function index(req, res) {
  req.session.controller = "";
  if(!req.session.user) {
    res.render('login', {
      layout: 'application',
      req: req
    });
  }else{
    res.render('index', {
      layout: 'application',
      req: req
    });
  }
}

//do ACS user login
function login(req, res) {
  ACS.Users.login({
    login: req.body.un,
    password: req.body.pw
  }, function(data) {
    if(data.success) {
      var user = data.users[0];
      if(user.first_name && user.last_name) {
        user.name = user.first_name + ' ' + user.last_name;
      } else {
        user.name = user.username;
      }
      req.session.flash = {msg:"Hello " + user.name + ".", r:0};
      req.session.user = user;
      res.redirect('/');
      logger.info('User logged in: ' + user.name);
    } else {
      req.session.flash = {msg:data.message, r:0};
      res.render('login', {
        layout: 'application',
        user: req.session.user,
        req: req
      });
    }
  }, req, res);
}

function _login(req, res) {
  req.session.controller = "";
  if(!req.session.user) {
    res.render('login', {
      layout: 'application',
      req: req
    });
  }else{
    res.render('index', {
      layout: 'application',
      req: req
    });
  }
}
