/**
 * 路由控制
 */
var login = require('./routes/login')
   ,register = require('./routes/register')
   ,student = require('./routes/student')


var admin = require('./routes/admin/index')
   ,adminUser = require('./routes/admin/user')
   ,adminNotice = require('./routes/admin/notice')
   ,adminQuestion = require('./routes/admin/question')

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
  //--------------------
  //    学生个人中心
  //--------------------
  app.get('/:username',student.index);



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
  app.post('/admin/user',adminUser.index);
  // 增加用户
  app.get('/admin/user/add',adminUser.adduser);
  app.post('/admin/user/add',adminUser.adduser);
  // 查看&修改用户
  app.get('/admin/user/info',adminUser.infouser);
  app.post('/admin/user/info',adminUser.infouser);
  //------------------
  //     公告发布
  //------------------
  app.get('/admin/notice',adminNotice.index);
  app.post('/admin/notice',adminNotice.index);
  //------------------
  //     问题管理
  //------------------
  app.get('/admin/question',adminQuestion.index);
  app.post('/admin/question',adminQuestion.index);
  //分类&章节&专题
  app.get('/admin/question/cat',adminQuestion.cat);
  app.post('/admin/question/cat',adminQuestion.cat);
  //------------------
  //    友情链接
  //------------------
  app.get('/admin/link',adminNotice.link);
  app.post('/admin/link',adminNotice.link);
  //-----------------
  //     退出
  //-----------------
  app.get('/logout',function(req,res){
    req.session.user = null;
    return res.redirect('/');
  })
} 