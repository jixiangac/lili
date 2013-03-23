/**
 * Index.js
 */
define(function(require){
  var $ = require('jquery');
  window.$ = $;
  var ajax = require('./models/ajax');
  $('.ajax-form').on('submit',ajax.ajaxForm);
})