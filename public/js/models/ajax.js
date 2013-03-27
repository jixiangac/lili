/**
 * @Description     Ajax
 * @Author          jixiangac
 * @Date            2013/03/02
 */

define(function(require,exports,module){
  var popbox = require('./popbox')
     ,validate = require('./validate');
  var ajaxForm = function(){
    for(var i=0,re=$('.require'),len =re.length;i<len;i++){
      if( !validate.require.call(re[i]) ) {
        return false;break;
      }
    }
    var formId = this.id;
    var data = $(this).serialize();
    var tips = new popbox.tinyTips();
    $.ajax({
        url : $(this).attr('action')
       ,type : $(this).attr('method')
       ,data : data
       ,dataType : 'json'
       ,beforsend: function(){
         // var tips = new popbox.tinyTips();
       }
       ,success : function(res){
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
         
       }
    });
    return false;
  }
  exports.ajaxForm = ajaxForm;
});