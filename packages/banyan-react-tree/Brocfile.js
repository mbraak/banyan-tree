var pickFiles = require('broccoli-static-compiler');
var fastBrowserify = require('broccoli-fast-browserify');
var babelTranspiler = require('broccoli-babel-transpiler');
var mergeTrees = require('broccoli-merge-trees');
var compileCSS = require('broccoli-postcss');
var Funnel = require('broccoli-funnel');


var lib_tree = pickFiles('src', {
	files: ['**/*.js'],
	srcDir: '.',
	destDir: './build'
});

var babel_tree = babelTranspiler(
    lib_tree, {
        browserPolyfill: true,
        stage: 0
    });

var browserify_tree = fastBrowserify(
    babel_tree, {
        bundles: {
    		'example.js': {
    			entryPoints: ['./build/examples/example.js']
    		}
    	}
    }
);

var css_tree = compileCSS(
    ['css'],
    'banyan-react-tree.css',
    'banyan-react-tree.css',
    [
        {module: require('postcss-nested')}
    ]
);

var example_tree = new Funnel(
    'examples', {
        destDir: './'
    }
);

module.exports = mergeTrees([browserify_tree, css_tree, example_tree]);
