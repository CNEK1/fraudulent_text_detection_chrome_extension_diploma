import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import CopyPlugin from "copy-webpack-plugin";
import autoprefixer from "autoprefixer";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

export const CSSModuleLoader = {
  loader: "css-loader",
  options: {
    modules: true,
    // localIdentName: "[name]_[local]_[hash:base64:5]",
    importLoaders: 2,
    // camelCase: true,
    sourceMap: false, // turned off as causes delay
  },
};
// For our normal CSS files we would like them globally scoped
export const CSSLoader = {
  loader: "css-loader",
  options: {
    modules: "global",
    importLoaders: 2,
    // camelCase: true,
    sourceMap: false, // turned off as causes delay
  },
};
// Our PostCSSLoader
export const PostCSSLoader = {
  loader: "postcss-loader",
  options: {
    // ident: "postcss",
    // sourceMap: false, // turned off as causes delay
    // Use the postcssOptions property
    // postcssOptions: {
    //   plugins: () => [
    //     autoprefixer({
    //       browsers: [">1%", "last 4 versions", "Firefox ESR", "not ie < 9"],
    //     }),
    //   ],
    // },
  },
};

// Standard style loader (prod and dev covered here)
const devMode = process.env.NODE_ENV !== "production";
export const styleLoader = devMode
  ? "style-loader"
  : MiniCssExtractPlugin.loader;

export default {
  mode: "production",
  entry: {
    contentScript: "./src/content/index.js",
    background: "./src/background/index.js",
    react: "./src/react/index.jsx",
  },
  output: {
    path: path.resolve("dist"),
    filename: "[name].js",
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve("manifest.json"),
          to: path.resolve("dist"),
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /\.module\.(sa|sc|c)ss$/,
        use: [styleLoader, CSSLoader, PostCSSLoader, "sass-loader"],
      },
      {
        test: /\.module\.(sa|sc|c)ss$/,
        use: [styleLoader, CSSModuleLoader, PostCSSLoader, "sass-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
