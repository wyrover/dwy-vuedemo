var gulp=require('gulp');
var concat=require('gulp-concat');
var uglify=require('gulp-uglify');

gulp.task('build',function(){
  return gulp.src(['./app/**/*.js','!./app/boot.js'])
    .pipe(concat('bundle.js'))
    //.pipe(uglify({
    //  mangle: {
    //    except: ['require', 'module', 'exports']
    //  },
    //  preserveComments: false
    //}))
    .pipe(gulp.dest('./dist/'));
});