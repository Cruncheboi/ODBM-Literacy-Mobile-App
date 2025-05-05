module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // "transform-remove-console",
      'react-native-reanimated/plugin', // must be last
    ]
  };
};