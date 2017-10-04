const webpack = require("webpack");
const path = require("path");

module.exports = {
	devtool: "source-map",
	entry: "./index.ts",
	output: {
		filename: "index.js"
	},
	resolve: {
		extensions: [".js", ".ts"],
		alias: {
			"vue$": "vue/dist/vue.esm.js"
		}
	},
	module: {
		rules: [{
			enforce: "pre",
			test: /\.js$/,
			loader: "source-map-loader"
		}, {
			test: /\.ts$/,
			loader: "ts-loader"
		}]
	}
};