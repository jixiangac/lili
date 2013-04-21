/**
 * 路由控制
 */
var login = require('./routes/login')
   ,register = require('./routes/register')
   ,student = require('./routes/student')
   ,teacher = require('./routes/teacher')
   ,question = require('./routes/question')


var admin = require('./routes/admin/index')
   ,adminUser = require('./routes/admin/user')
   ,adminNotice = require('./routes/admin/notice')
   ,adminQuestion = require('./routes/admin/question')

module.exports = function(app){
  /*===================
          前台路由
    ===================*/
  app.get('/test',login.test);
  //-------------------
  //       登陆
  //-------------------
  app.get('/',login.index);
  app.post('/',login.index);
  //-------------------
  //      注册
  //-------------------
  app.get('/reg',checkNotLogin);
  app.get('/reg',register.index);
  app.post('/reg',register.index);
  //--------------------
  //    个人资料
  //--------------------
  app.all('/stu/*',checkLogin);
  app.get('/stu/:username',student.index);
  app.post('/stu/:username',student.index);
  //-------------------
  //   自动问答
  //-------------------
  app.get('/q/robot',question.index);
  app.post('/q/robot',question.index);
  //------------------
  //   给老师提问
  //------------------
  app.get('/q/teacher',question.ask);
  // app.post('/q/teacher',question.ask);
  //------------------
  //    我提问的
  //------------------
  app.get('/stu/:username/question',question.noslove);
  /*----------------------
          老师模块
    ---------------------*/
  //-------------------
  //   老师首页
  //-------------------
  app.all(/\/teach\/?\w*/,function(req,res,next){
    if(!!req.session.user){
       if(req.session.user.cat === 1){
          return res.redirect('/');
       }else if(req.session.user.cat === 3){
          return res.redirect('/admin');
       }
      next();
    }else{
      return res.redirect('/');
    }
  });
  app.get('/teach',teacher.index);
  //--------------------
  //     个人资料-老师
  //--------------------
  app.get('/teach/:username',teacher.info);
  //------------------
  //    老师答疑问题
  //-------------------
  app.get('/teach/:username/question',question.toslove);
  app.post('/teach/question',question.toslove);
  /*===================
          后台路由
    ===================*/
  app.all(/\/admin\/?\w*/,function(req,res,next){
    if(!req.session.user || req.session.user.cat !==3){
       return res.redirect('/');
    }
    next();
  });
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
  app.post('/user/info',adminUser.infouser);
  //------------------
  //     公告发布
  //------------------
  app.get('/admin/notice',adminNotice.index);
  app.post('/admin/notice',adminNotice.index);
  //------------------
  //     问题管理
  //------------------
  app.get('/admin/question',adminQuestion.index);
  app.post('/question',adminQuestion.index);
  //分类&章节&专题
  app.get('/admin/question/cat',adminQuestion.cat);
  app.post('/admin/question/cat',adminQuestion.cat);
  app.get('/admin/question/cat/get',adminQuestion.getCat);
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

function checkLogin(req,res,next){
  if(!req.session.user){
     return res.redirect('/');
  }
  next();
}
function checkNotLogin(req,res,next){
  if(req.session.user){
    return res.redirect('/');
  }
  next();
}