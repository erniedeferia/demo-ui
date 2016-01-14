// Node modules
var fs = require('fs'), vm = require('vm'), merge = require('deeply'), chalk = require('chalk'), es = require('event-stream'), path = require('path'), url = require('url');



// Gulp and plugins
var gulp = require('gulp'), rjs = require('gulp-requirejs-bundler'), concat = require('gulp-concat'), clean = require('gulp-clean'), filter = require('gulp-filter'),
    replace = require('gulp-replace'), uglify = require('gulp-uglify'), htmlreplace = require('gulp-html-replace'),
    connect = require('gulp-connect'), babelCore = require('babel-core'), babel = require('gulp-babel'), objectAssign = require('object-assign');


var modernizr = require('gulp-modernizr');


// Config
var requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync('src/app/require.config.js') + '; require;'),
    requireJsOptimizerConfig = merge(requireJsRuntimeConfig, {
        out: 'scripts.js',
        baseUrl: './src',
        name: 'app/startup',
        paths: {
            requireLib: 'bower_modules/requirejs/require'
        },
        include: [
            // Put static, up-front loaded modules here.
            'requireLib',
            'components/main-menu/main-menu',
            'components/todo-menu/todo-menu',
            'components/dashboard/dashboard',
            'components/dashboard-element/dashboard-element',
            'components/todos/add/add',
            'components/core/smartform/smartform'
        ],
        insertRequire: ['app/startup'],
        bundles: {
            // Put dynamicaly, on-demand, loaded modules here.
            "misc-raw":        ['app/misc'],
            "help-bundle": ['text!components/help/help.html'],
            "todos":   ['components/todo-list/todo-list', 'components/todos/index']

        }
    }),
    transpilationConfig = {
        root: 'src',
        skip: ['bower_modules/**', 'app/require.config.js', 'app/misc-raw.js'],
        babelConfig: {
            modules: 'amd',
            sourceMaps: 'inline'
        }
    },
    babelIgnoreRegexes = transpilationConfig.skip.map(function(item) {
        return babelCore.util.regexify(item);
    });

// Pushes all the source files through Babel for transpilation
gulp.task('js:babel', function() {
    return gulp.src(requireJsOptimizerConfig.baseUrl + '/**/*')
        .pipe(es.map(function(data, cb) {
            if (!data.isNull()) {
                babelTranspile(data.relative, function(err, res) {
                    if (res) {
                        data.contents = new Buffer(res.code);
                    }
                    cb(err, data);
                });
            } else {
                cb(null, data);
            }
        }))
        .pipe(gulp.dest('./temp'));
});

// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
gulp.task('js:optimize', ['js:babel'], function() {
    var config = objectAssign({}, requireJsOptimizerConfig, { baseUrl: 'temp' });
    return rjs(config)
        .pipe(uglify({ preserveComments: 'some' }))
        .pipe(gulp.dest('./dist/'));
});

// Builds the distributable .js files by calling Babel then the r.js optimizer
gulp.task('js', ['js:optimize'], function () {
    // Now clean up
    return gulp.src('./temp', { read: false }).pipe(clean())
        .pipe(connect.reload());
});



// Concatenates CSS files, rewrites relative paths to Bootstrap fonts, copies Bootstrap fonts
gulp.task('css', function () {
    var bowerCss = gulp.src(['src/bower_modules/components-bootstrap/css/bootstrap.min.css',
                             'src/bower_modules/jquery-ui/themes/base/jquery-ui.css'
                             ])
            .pipe(replace(/url\((')?\.\.\/fonts\//g, 'url($1fonts/')),
        appCss = gulp.src('src/css/*.css'),
        combinedCss = es.concat(bowerCss, appCss).pipe(concat('css.css')),
        fontFiles = gulp.src('./src/bower_modules/components-bootstrap/fonts/*', { base: './src/bower_modules/components-bootstrap/' });
    return es.concat(combinedCss, fontFiles)
        .pipe(gulp.dest('./dist/'));
});

//
// Invokek this task to create or update the Modernizr file
//
gulp.task('modernizr', function() {
    return gulp.src('./src/app/misc.js')
        .pipe(modernizr('modernizr.js'))
        .pipe(gulp.dest("./src/app/"));
});


// copies fonts
gulp.task('fonts', function() {
    return gulp.src('./src/fonts/*.*')
        .pipe(gulp.dest('./dist/fonts/'));
});

// copies images
gulp.task('images', function() {
    return gulp.src('./src/bower_modules/jquery-ui/themes/base/images/*.png')
        .pipe(gulp.dest('./dist/images/'));
});


// Copies index.html, replacing <script> and <link> tags to reference production URLs
gulp.task('html', function() {
    return gulp.src('./src/index.html')
        .pipe(htmlreplace({
            'css': 'css.css',
            'js': 'scripts.js'
        }))
        .pipe(gulp.dest('./dist/'))
        .pipe(connect.reload());
});

// Removes all files from ./dist/
gulp.task('clean', function() {
    return gulp.src('./dist/**/*', { read: false })
        .pipe(clean());
});

// Starts a simple static file server that transpiles ES6 on the fly to ES5
gulp.task('serve:src', function() {
    return connect.server({
        root: transpilationConfig.root,
        livereload: true,
        middleware: function(connect, opt) {
            return [
                 function (req, res, next) {
                     var pathname = path.normalize(url.parse(req.url).pathname);
                     babelTranspile(pathname, function(err, result) {
                        if (err) {
                            next(err);
                        } else if (result) {
                            res.setHeader('Content-Type', 'application/javascript');
                            res.end(result.code);
                        } else {
                            next();
                        }
                     });
                 }
            ];
        }
    });
});

// After building, starts a trivial static file server
gulp.task('serve:dist', ['default'], function() {
    return connect.server({ root: './dist',
                            livereload: true
                          });
});


gulp.task('watch', function() {
    var tasks = ['html','js','css'];
    gulp.watch('src/**/*.*', tasks);
});


function babelTranspile(pathname, callback) {
    if (babelIgnoreRegexes.some(function (re) { return re.test(pathname); })) return callback();
    if (!babelCore.canCompile(pathname)) return callback();
    var src  = path.join(transpilationConfig.root, pathname);
    var opts = objectAssign({ sourceFileName: '/source/' + pathname }, transpilationConfig.babelConfig);
    babelCore.transformFile(src, opts, callback);
}

gulp.task('default', ['html', 'js','css', 'fonts', 'images'], function(callback) {
    callback();
    console.log('\nPlaced optimized files in ' + chalk.magenta('dist/\n'));
});
