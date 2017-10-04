module.exports = {
	devtool: "source-map",
	entry: "./index.ts",
	output: {
		filename: "index.js"
	},
	resolve: {
		extensions: [".js", ".ts"]
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