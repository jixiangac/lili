/**
 * 注册Routes
 */

var jixiang = require('../models/base');
var crypto = require('crypto');
var config = require('../config');

var index = function(req,res){
  if(req.method == 'GET'){
    res.render('./index/reg',
      {
        title : config.name
       ,user :  req.session.user
      });
  }else if(req.method == 'POST'){
    if(req.body['repassword'] != req.body['password']){
      return res.json({flg:0,pwderror:1,msg:'密码不一致'});
    }
    //生成口令散列
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    var userdata = {
       username : req.body.username
      ,password : password
      ,sex : req.body.sex
      ,birthday : req.body.birthYear+'-'+req.body.birthMonth+'-'+req.body.birthDay
      ,regdate : Date.now()
      ,logindate : Date.now()
    };
    jixiang.getOne({
      username:userdata.username
    },'users',function(err,doc){
      if(doc){
        err = '用户名已经存在!';
      }
      if(err){
        return res.json({flg:0,msg:err});
      }
      jixiang.save(userdata,'users',function(err,doc){
        if(err){
          return res.json({flg:0,msg:err});
        }
        req.session.user = doc[0];
        res.json({flg:1,msg:'注册成功！',redirect:'/'});
      });
      
    });
  }
}
exports.index = index;