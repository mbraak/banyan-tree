var broccoliBrowserify = require('broccoli-fast-browserify');
var broccoliBabel = require('broccoli-babel-transpiler');
var mergeTrees = require('broccoli-merge-trees');
var broccoliPostCss = require('broccoli-postcss');
var Funnel = require('broccoli-funnel');

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
	return mergeTrees([
		tasks.browserifyExample(
			tasks.babel(
				new Funnel('src', {destDir: './building'})
			)
		),
		tasks.compileBanyanCss(),
		tasks.copyExampleAssets()
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
