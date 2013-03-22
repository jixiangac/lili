seajs.config({
  // Set aliases for common libraries
  alias: {
    'jquery': 'lib/jquery.js'
  },
  // Add plugins
  plugins: ['shim'],

  // Configure shim for non-CMD modules
  shim: {
    'jquery': {
      exports: 'jQuery'
    }
  },
  // 预加载jQuery
  preload: ["jquery"]
});