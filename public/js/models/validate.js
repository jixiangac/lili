/**
 * @Description     表单验证类
 * @Author          jixiangac
 * @Email           jixiangac@gmail.com
 * @Date            2013/03/05
 */
define(function(require,exports,module){
  //验证规则
  var pattern = {
    'realname' :{
       name : '真实姓名'
      ,rex : '^[\u4e00-\u9fa5]{2,}$'
      ,tips : '请输入真实姓名！'
      ,error : '真实姓名由中文组成！'
    }
   ,'username':{
       name :　'用户名'
      ,rex : '^[\\w]{3,10}'
      ,tips : '请输入用户名！'
      ,error : '用户名由字母、数字、下划线组成！'
    }
   ,'email' : {
      name : '邮箱'
     ,rex : '^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$'
     ,tips : '请输入邮箱'
     ,error : '邮箱格式出错！'
   }
   ,'password' : {
      name : '密码'
     ,rex : '^[\\w]{6,12}$'
     ,tips : '请输入6位以上的密码'
     ,error : '请输入6位以上的密码！'
   }
   ,'repassword' :{
      name : '重复密码'
     ,rex : '^[\\w]{6,12}$'
     ,tips : '请重复输入密码'
     ,error : '请输入6位以上的密码！'
   }
   ,'website' : {
     name : '网站名称'
    ,rex : '^[^\\s]+$'
    ,tips : '请输入网站名称'
    ,error : '网站名称至少两个字！'
   }
   ,'url' : {
     name : '网站地址'
    ,rex : '^[a-zA-z]+:\/\/[^\\s]*$'
    ,tips : '请输入网站地址'
    ,error : '网站地址出错！'
   }
   ,'q' : {
     name : '问题'
    ,rex : '^[^\\s]+$'
    ,tips : '请输入问题！'
    ,error :'问题不能为空哦！'
   }
  }
  function getLen(s){
    var l = 0;  
    var a = s.split('');
    for(var i=0,len=a.length;i<len;i++){
      if( a[i].charCodeAt(0)<299 ){
        l++;
      }else{
        l+=2;
      }
    }
    return l;
  }
  var blurValidate = function(){
    var name = this.name
       ,value = $.trim(this.value);
     if(name === 'repassword'){
       if( value !== $.trim($('#password').val())){
         Tips(this,'error','两次密码不一致！');
         return false;
       }
     }
    var rex = new RegExp(pattern[name].rex,'gi');
    if(rex.test(value)){
      if($(this).attr('data-flag') === 'e-login'){
        $(this).next().html('');
        return false;
      }
       Tips(this,'right','')
       this.style.cssText='';
    }else{
      Tips(this,'error',pattern[name].error);
    }

  }
  exports.blurValidate = blurValidate;

  //默认提示信息
  function Tips(obj,flag,tips){
    $(obj).next('span').html('<em class="help-'+flag+'"></em>'+tips);
  }
  exports.defTips = function(){
     Tips(this,'tips',pattern[this.name].tips)
  }
  var popbox = require('./popbox');
  //验证必填项目
  var require = function(){
    var name = this.name
       ,value = $.trim(this.value);
    if( value.length == 0){
       new popbox.tinyTips('error',pattern[name].name+'不能为空！');
       return false;
    }
    if(name === 'repassword'){
       if( value !== $.trim($('#password').val())){
         new popbox.tinyTips('error','两次密码不一致！');
         return false;
       }
    }
    var rex = new RegExp(pattern[name].rex,'gi');
    if(!rex.test(value)){
       new popbox.tinyTips('error',pattern[name].error);
       return false;
    }
    return true;
  }
  exports.require = require;
});