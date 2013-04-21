/**
 *  后台首页
 */
var config = require('../../config')
   ,jixiang = require('../../models/base');

var index = function(req,res){
   if(req.method == 'GET'){
     res.redirect('/admin/notice')
   }else if(req.method == 'POST'){

   }
}
exports.index = index;