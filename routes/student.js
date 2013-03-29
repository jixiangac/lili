/**
 * student.js
 */
var jixiang = require('../models/base');
var crypto = require('crypto');
var config = require('../config');

var index = function(req,res){
  res.render('./index/student',{
    title : '学生个人中心'
   ,user :　req.session.user
  })
}