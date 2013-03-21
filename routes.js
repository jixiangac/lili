/**
 * 路由控制
 */
var login = require('./routes/login')
   ,register = require('./routes/register')

module.exports = function(app){
  /*========================
           前台路由
    =======================*/
  //-------------------
  //       登陆
  //-------------------
  app.get('/login',login.index);
  app.post('/login',login.index);
  //-------------------
  //      注册
  //-------------------
  app.get('/reg',register.index);
  app.post('/reg',register.index);
}