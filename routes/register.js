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
    var cat = parseInt(req.query.cat,10) || 1;
    //普通用户注册时候需要验证密码是否相同
    if(cat ==1){
      if(req.body['repassword'] != req.body['password']){
        return res.json({flg:0,pwderror:1,msg:'密码不一致'});
      }      
    }
    //生成口令散列
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    var userdata = {
       username : req.body.username
      ,password : password
      ,email : req.body.email
      ,cat : cat
      ,regdate : Date.now()
      ,logindate : Date.now()
    };
    if(cat === 3){
      userdata.rank = req.body.rank;
    }else{
      userdata.sex = req.body.sex;
    }
    if(cat === 2){
      userdata.school = req.body.school;
    }
    jixiang.getOne({
       username:userdata.username
      ,cat : cat
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
        var msg ='注册成功',redirect = '/';
        if(cat === 1){
          req.session.user = doc[0];
        }else{
          msg = '增加成功';
          redirect = '/admin/user?cat='+cat
        }
        res.json({flg:1,msg:msg,redirect:redirect});
      });
      
    });
  }
}
exports.index = index;