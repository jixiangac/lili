/**
 * 路由控制
 */
var login = require('./routes/login')
   ,register = require('./routes/register')


var admin = require('./routes/admin/index')
   ,adminUser = require('./routes/admin/user.js')

module.exports = function(app){
  /*===================
          前台路由
    ===================*/
  //-------------------
  //       登陆
  //-------------------
  app.get('/',login.index);
  app.post('/',login.index);
  //-------------------
  //      注册
  //-------------------
  app.get('/reg',register.index);
  app.post('/reg',register.index);





  /*===================
          后台路由
    ===================*/
  //-------------------
  //       首页
  //-------------------
  app.get('/admin',admin.index);
  app.post('/admin',admin.index);
  //-------------------
  //      用户
  //-------------------
  app.get('/admin/user',adminUser.index);
  // 增加用户
  app.get('/admin/user/add',adminUser.adduser);
  app.post('/admin/user/add',adminUser.adduser);
  // 查看&修改用户
  app.get('/admin/user/info',adminUser.infouser);
  app.post('/admin/user/info',adminUser.infouser);







  //-----------------
  //     退出
  //-----------------
  app.get('/logout',function(req,res){
    req.session.user = null;
    return res.redirect('/');
  })
} 