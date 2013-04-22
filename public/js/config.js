seajs.config({
  // Add plugins
   plugins: ['shim'],
  // Configure shim for non-CMD modules
  alias: {
    'jquery': {
      src : 'lib/jquery.js',
      exports: 'jQuery'
    },
    'highcharts' : {
      src : 'lib/highcharts.js',
      exports : 'highcharts'
    },
    'kalendae' : {
      src : 'lib/kalendae.js',
      exports : 'kalendae'
    }
  },
  //Set aliases for common libraries
  // alias: {
  //   'jquery': 'lib/jquery.js',
  //   'highcharts' :'lib/highcharts.js',
  //   'kalendae' :'lib/kalendae.js'
  // },
  //预加载jQuery
  preload: ["lib/jquery"]
});