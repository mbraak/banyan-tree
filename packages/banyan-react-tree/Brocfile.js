var broccoliBrowserify = require('broccoli-fast-browserify');
var broccoliBabel = require('broccoli-babel-transpiler');
var mergeTrees = require('broccoli-merge-trees');
var broccoliPostCss = require('broccoli-postcss');
var Funnel = require('broccoli-funnel');
var broccoliEsLint = require('broccoli-lint-eslint');
var broccoliBrowserSync = require('broccoli-browser-sync');

var is_production = require('broccoli-env').getEnv() == 'production';


var tasks = {
	babel: function(tree) {
		return broccoliBabel(
		    tree,
			{
		        browserPolyfill: true,
		        stage: 0
		    }
		);
	},

	browserifyExample: function(tree) {
		return broccoliBrowserify(
		    tree, {
		        bundles: {
		    		'example.js': {
		    			entryPoints: ['./building/examples/example.js']
		    		}
		    	}
		    }
		);
	},

	compileBanyanCss: function() {
		return broccoliPostCss(
		    ['css'],
		    'banyan-react-tree.css',
		    'banyan-react-tree.css',
		    [
		        {module: require('postcss-nested')}
		    ]
		);
	},

	copyExampleAssets: function() {
		return new Funnel('examples');
	}
}


function runDevelopment() {
	var input_files = new Funnel('src', {destDir: './building'});

	var example_js_task = tasks.browserifyExample(
		tasks.babel(input_files)
	);
	var css_task = tasks.compileBanyanCss();
	var example_static_task = tasks.copyExampleAssets();

	var browserSync = broccoliBrowserSync([
		example_js_task,
		css_task,
		example_static_task
	]);

	return mergeTrees([
		example_js_task,
		css_task,
		example_static_task,
		broccoliEsLint(input_files, {}),
		browserSync
	]);
}


function runProduction() {
	return mergeTrees([
		tasks.babel(
			new Funnel('src', {include: ['*.js']})
		),
		tasks.compileBanyanCss()
	]);
}


function run() {
	if (is_production) {
		return runProduction();
	}
	else {
		return runDevelopment();
	}
}


module.exports = run();
