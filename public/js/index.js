/**
 * Index.js
 */
define(function(require){
  var $ = require('jquery');
  window.$ = $;
  var ajax = require('./models/ajax');
  $('.ajax-form').on('submit',ajax.ajaxForm);
  require('./lib/kalendae');
      new Kalendae.Input('date', {
      months:1
     ,direction:'future'
     ,format : 'YYYY-MM-DD'
    });
})