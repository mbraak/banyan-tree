var pickFiles = require('broccoli-static-compiler');
var fastBrowserify = require('broccoli-fast-browserify');
var babelTranspiler = require('broccoli-babel-transpiler');
var mergeTrees = require('broccoli-merge-trees');
var compileCSS = require('broccoli-postcss');
var Funnel = require('broccoli-funnel');


function createSourceTree() {
	return pickFiles('src', {
		files: ['**/*.js'],
		srcDir: '.',
		destDir: './build'
	});
}

function createBabelTree(source_tree) {
	return babelTranspiler(
	    source_tree,
		{
	        browserPolyfill: true,
	        stage: 0
	    }
	);
}

function createBrowserifyTree(babel_tree) {
	return fastBrowserify(
	    babel_tree, {
	        bundles: {
	    		'example.js': {
	    			entryPoints: ['./build/examples/example.js']
	    		}
	    	}
	    }
	);
}

function createCssTree() {
	return compileCSS(
	    ['css'],
	    'banyan-react-tree.css',
	    'banyan-react-tree.css',
	    [
	        {module: require('postcss-nested')}
	    ]
	);
}

function createExampletree() {
	return new Funnel(
	    'examples', {
	        destDir: './'
	    }
	);
}

module.exports = mergeTrees([
	createBrowserifyTree(
		createBabelTree(
			createSourceTree()
		)
	),
	createCssTree(),
	createExampletree()
]);
