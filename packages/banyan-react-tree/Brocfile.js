const broccoliBrowserify = require("broccoli-fast-browserify");
const broccoliBabel = require("broccoli-babel-transpiler");
const mergeTrees = require("broccoli-merge-trees");
const broccoliPostCss = require("broccoli-postcss");
const Funnel = require("broccoli-funnel");

const is_production = require("broccoli-env").getEnv() === "production";


const tasks = {
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
				cache: false,
		        bundles: {
		    		"example.js": {
		    			entryPoints: ["./building/examples/example.js"]
		    		}
		    	}
		    }
		);
	},

	compileBanyanCss: function() {
		return broccoliPostCss(
		    ["css"],
		    "banyan-react-tree.css",
		    "banyan-react-tree.css",
		    [
		        {module: require("postcss-nested")}
		    ]
		);
	},

	copyExampleAssets: function() {
		return new Funnel("examples");
	}
};


function runDevelopment() {
	const input_files = new Funnel("src", {destDir: "./building"});

	return mergeTrees([
		tasks.browserifyExample(
			tasks.babel(input_files)
		),
		tasks.compileBanyanCss(),
		tasks.copyExampleAssets()
	]);
}


function runProduction() {
	return mergeTrees([
		tasks.babel(
			new Funnel("src", {include: ["*.js"]})
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
