/**
 * [format_date 格式化日期格式]
 * @param  {[type]} date [日期参数]
 * @return {[type]}      [返回值]
 */
exports.format_date = function (date,flag) {//flag 为true返回时分秒
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var result ='';
  result+=year + '-' + month + '-' + day; 
  if(flag){
    hour = ((hour < 10) ? '0' : '') + hour;
    minute = ((minute < 10) ? '0' : '') + minute;
    second = ((second < 10) ? '0': '') + second;
    result+=' '+hour + ':' + minute + ':' + second;
  }
  return result;
};