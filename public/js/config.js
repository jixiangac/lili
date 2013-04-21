seajs.config({
  // Add plugins
  plugins: ['shim'],
  // Configure shim for non-CMD modules
  shim: {
    'jquery': {
      exports: 'jQuery'
    }
  },
  // Set aliases for common libraries
  alias: {
    'jquery': 'lib/jquery.js',
    'highcharts' :'lib/highcharts.js',
    'kalendae' :'lib/kalendae.js'
  },
  // 预加载jQuery
  preload: ["jquery"]
});