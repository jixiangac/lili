/**
 * Index.js
 */
define(function(require){
  var $ = require('jquery');
  window.$ = $;
  var ajax = require('./models/ajax');
  $('.ajax-form').on('submit',ajax.ajaxForm);

  //日期
  if(location.href.indexOf('notice')!==-1){
    require('./lib/kalendae');
    new Kalendae.Input('date', {
      months:1
     ,format : 'YYYY-MM-DD'
    });    
  }

  //删除
  var popbox = require('./models/popbox');
  $('.btn-del').on('click',function(){
    if(!confirm('确定删除吗？'))return false;
    var url = $(this).attr('href');
    var tips = new popbox.tinyTips();
    $.post(url,{},function(res){
       if(res.flg === 1){
         $('.tiny-tips').html('<span class="tiny-right"></span>'+res.msg+'<span class="tiny-end"></span>');
         setTimeout(function(){
           if(res.redirect)
             window.location.href = res.redirect;
           else
             window.location.reload();
         },2000);
       }else{
         tips.close();
         new popbox.tinyTips('error',res.msg);
       }
    });
    return false;
  });
})