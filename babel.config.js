module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@": "./src",
            "@/components": "./src/components",
          },
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      ],
      // Keep Reanimated plugin last
      "react-native-worklets/plugin",
    ],
  };
};

