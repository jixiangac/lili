/**
 * 路由控制
 */
var login = require('./routes/login');
module.expors = function(app){
  /*========================
           前台路由
    =======================*/
  //-------------------
  //       登陆
  //-------------------
  app.get('/login',login.index);
  app.post('/login',login.index);
}