module.exports = function(grunt){
  grunt.initConfig({
     pkg : grunt.file.readJSON("package.json"),

     transport : {
        options : {
          paths : ['.']
         ,alias : '<%= pkg.spm.alias %>'
        }
        ,models : {
          options : {
            idleading : 'dist/models/'
          }
         ,files : [
           {
              cwd : 'models'
             ,src : '*'
             ,filter : 'isFile'
             ,dest : '.build/models'
           }
         ]
        }
        ,index : {
          options : {
            idleading : 'dist/'
          }
          ,files : [
            {
               cwd : ''
              ,src : 'index.js'
              ,filter : 'isFile'
              ,dest : '.build'
            }
          ]
        }
     }
    
    ,concat : {
      options : {
        paths : ['.'],
        include : 'relative'
      }
     ,index : {
        options : {
          include : 'relative'
        }
       ,files : {
          'dist/index.js' : ['.build/index.js'],
          'dist/index-debug.js' : ['.build/index-debug.js']
       }
     }
    }
    // ,uglify: {
    //   index : {
    //     files : {
    //       'dist/index.js' : ['dist/index.js']
    //     }
    //   }
    // }
    
    ,clean : {
      spm : ['.build']
    }
  });

  grunt.loadNpmTasks('grunt-cmd-transport');
  grunt.loadNpmTasks('grunt-cmd-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('build',['transport','concat','clean']);
}