"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var path2 = __toESM(require("path"), 1);
var process3 = __toESM(require("process"), 1);

// node_modules/.pnpm/chalk@5.4.1/node_modules/chalk/source/vendor/ansi-styles/index.js
var ANSI_BACKGROUND_OFFSET = 10;
var wrapAnsi16 = (offset = 0) => (code) => `\x1B[${code + offset}m`;
var wrapAnsi256 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`;
var wrapAnsi16m = (offset = 0) => (red, green, blue) => `\x1B[${38 + offset};2;${red};${green};${blue}m`;
var styles = {
  modifier: {
    reset: [0, 0],
    // 21 isn't widely supported and 22 does the same thing
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    overline: [53, 55],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29]
  },
  color: {
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    // Bright color
    blackBright: [90, 39],
    gray: [90, 39],
    // Alias of `blackBright`
    grey: [90, 39],
    // Alias of `blackBright`
    redBright: [91, 39],
    greenBright: [92, 39],
    yellowBright: [93, 39],
    blueBright: [94, 39],
    magentaBright: [95, 39],
    cyanBright: [96, 39],
    whiteBright: [97, 39]
  },
  bgColor: {
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],
    // Bright color
    bgBlackBright: [100, 49],
    bgGray: [100, 49],
    // Alias of `bgBlackBright`
    bgGrey: [100, 49],
    // Alias of `bgBlackBright`
    bgRedBright: [101, 49],
    bgGreenBright: [102, 49],
    bgYellowBright: [103, 49],
    bgBlueBright: [104, 49],
    bgMagentaBright: [105, 49],
    bgCyanBright: [106, 49],
    bgWhiteBright: [107, 49]
  }
};
var modifierNames = Object.keys(styles.modifier);
var foregroundColorNames = Object.keys(styles.color);
var backgroundColorNames = Object.keys(styles.bgColor);
var colorNames = [...foregroundColorNames, ...backgroundColorNames];
function assembleStyles() {
  const codes = /* @__PURE__ */ new Map();
  for (const [groupName, group] of Object.entries(styles)) {
    for (const [styleName, style] of Object.entries(group)) {
      styles[styleName] = {
        open: `\x1B[${style[0]}m`,
        close: `\x1B[${style[1]}m`
      };
      group[styleName] = styles[styleName];
      codes.set(style[0], style[1]);
    }
    Object.defineProperty(styles, groupName, {
      value: group,
      enumerable: false
    });
  }
  Object.defineProperty(styles, "codes", {
    value: codes,
    enumerable: false
  });
  styles.color.close = "\x1B[39m";
  styles.bgColor.close = "\x1B[49m";
  styles.color.ansi = wrapAnsi16();
  styles.color.ansi256 = wrapAnsi256();
  styles.color.ansi16m = wrapAnsi16m();
  styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
  Object.defineProperties(styles, {
    rgbToAnsi256: {
      value(red, green, blue) {
        if (red === green && green === blue) {
          if (red < 8) {
            return 16;
          }
          if (red > 248) {
            return 231;
          }
          return Math.round((red - 8) / 247 * 24) + 232;
        }
        return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
      },
      enumerable: false
    },
    hexToRgb: {
      value(hex) {
        const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
        if (!matches) {
          return [0, 0, 0];
        }
        let [colorString] = matches;
        if (colorString.length === 3) {
          colorString = [...colorString].map((character) => character + character).join("");
        }
        const integer = Number.parseInt(colorString, 16);
        return [
          /* eslint-disable no-bitwise */
          integer >> 16 & 255,
          integer >> 8 & 255,
          integer & 255
          /* eslint-enable no-bitwise */
        ];
      },
      enumerable: false
    },
    hexToAnsi256: {
      value: (hex) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
      enumerable: false
    },
    ansi256ToAnsi: {
      value(code) {
        if (code < 8) {
          return 30 + code;
        }
        if (code < 16) {
          return 90 + (code - 8);
        }
        let red;
        let green;
        let blue;
        if (code >= 232) {
          red = ((code - 232) * 10 + 8) / 255;
          green = red;
          blue = red;
        } else {
          code -= 16;
          const remainder = code % 36;
          red = Math.floor(code / 36) / 5;
          green = Math.floor(remainder / 6) / 5;
          blue = remainder % 6 / 5;
        }
        const value = Math.max(red, green, blue) * 2;
        if (value === 0) {
          return 30;
        }
        let result = 30 + (Math.round(blue) << 2 | Math.round(green) << 1 | Math.round(red));
        if (value === 2) {
          result += 60;
        }
        return result;
      },
      enumerable: false
    },
    rgbToAnsi: {
      value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
      enumerable: false
    },
    hexToAnsi: {
      value: (hex) => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
      enumerable: false
    }
  });
  return styles;
}
var ansiStyles = assembleStyles();
var ansi_styles_default = ansiStyles;

// node_modules/.pnpm/chalk@5.4.1/node_modules/chalk/source/vendor/supports-color/index.js
var import_node_process = __toESM(require("process"), 1);
var import_node_os = __toESM(require("os"), 1);
var import_node_tty = __toESM(require("tty"), 1);
function hasFlag(flag, argv = globalThis.Deno ? globalThis.Deno.args : import_node_process.default.argv) {
  const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
  const position = argv.indexOf(prefix + flag);
  const terminatorPosition = argv.indexOf("--");
  return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
var { env } = import_node_process.default;
var flagForceColor;
if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
  flagForceColor = 0;
} else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
  flagForceColor = 1;
}
function envForceColor() {
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      return 1;
    }
    if (env.FORCE_COLOR === "false") {
      return 0;
    }
    return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
  }
}
function translateLevel(level) {
  if (level === 0) {
    return false;
  }
  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3
  };
}
function _supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
  const noFlagForceColor = envForceColor();
  if (noFlagForceColor !== void 0) {
    flagForceColor = noFlagForceColor;
  }
  const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
  if (forceColor === 0) {
    return 0;
  }
  if (sniffFlags) {
    if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
      return 3;
    }
    if (hasFlag("color=256")) {
      return 2;
    }
  }
  if ("TF_BUILD" in env && "AGENT_NAME" in env) {
    return 1;
  }
  if (haveStream && !streamIsTTY && forceColor === void 0) {
    return 0;
  }
  const min = forceColor || 0;
  if (env.TERM === "dumb") {
    return min;
  }
  if (import_node_process.default.platform === "win32") {
    const osRelease = import_node_os.default.release().split(".");
    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }
    return 1;
  }
  if ("CI" in env) {
    if (["GITHUB_ACTIONS", "GITEA_ACTIONS", "CIRCLECI"].some((key) => key in env)) {
      return 3;
    }
    if (["TRAVIS", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
      return 1;
    }
    return min;
  }
  if ("TEAMCITY_VERSION" in env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  }
  if (env.COLORTERM === "truecolor") {
    return 3;
  }
  if (env.TERM === "xterm-kitty") {
    return 3;
  }
  if ("TERM_PROGRAM" in env) {
    const version = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
    switch (env.TERM_PROGRAM) {
      case "iTerm.app": {
        return version >= 3 ? 3 : 2;
      }
      case "Apple_Terminal": {
        return 2;
      }
    }
  }
  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }
  if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
    return 1;
  }
  if ("COLORTERM" in env) {
    return 1;
  }
  return min;
}
function createSupportsColor(stream, options = {}) {
  const level = _supportsColor(stream, {
    streamIsTTY: stream && stream.isTTY,
    ...options
  });
  return translateLevel(level);
}
var supportsColor = {
  stdout: createSupportsColor({ isTTY: import_node_tty.default.isatty(1) }),
  stderr: createSupportsColor({ isTTY: import_node_tty.default.isatty(2) })
};
var supports_color_default = supportsColor;

// node_modules/.pnpm/chalk@5.4.1/node_modules/chalk/source/utilities.js
function stringReplaceAll(string, substring, replacer) {
  let index = string.indexOf(substring);
  if (index === -1) {
    return string;
  }
  const substringLength = substring.length;
  let endIndex = 0;
  let returnValue = "";
  do {
    returnValue += string.slice(endIndex, index) + substring + replacer;
    endIndex = index + substringLength;
    index = string.indexOf(substring, endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}
function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
  let endIndex = 0;
  let returnValue = "";
  do {
    const gotCR = string[index - 1] === "\r";
    returnValue += string.slice(endIndex, gotCR ? index - 1 : index) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
    endIndex = index + 1;
    index = string.indexOf("\n", endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}

// node_modules/.pnpm/chalk@5.4.1/node_modules/chalk/source/index.js
var { stdout: stdoutColor, stderr: stderrColor } = supports_color_default;
var GENERATOR = Symbol("GENERATOR");
var STYLER = Symbol("STYLER");
var IS_EMPTY = Symbol("IS_EMPTY");
var levelMapping = [
  "ansi",
  "ansi",
  "ansi256",
  "ansi16m"
];
var styles2 = /* @__PURE__ */ Object.create(null);
var applyOptions = (object, options = {}) => {
  if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
    throw new Error("The `level` option should be an integer from 0 to 3");
  }
  const colorLevel = stdoutColor ? stdoutColor.level : 0;
  object.level = options.level === void 0 ? colorLevel : options.level;
};
var chalkFactory = (options) => {
  const chalk2 = (...strings) => strings.join(" ");
  applyOptions(chalk2, options);
  Object.setPrototypeOf(chalk2, createChalk.prototype);
  return chalk2;
};
function createChalk(options) {
  return chalkFactory(options);
}
Object.setPrototypeOf(createChalk.prototype, Function.prototype);
for (const [styleName, style] of Object.entries(ansi_styles_default)) {
  styles2[styleName] = {
    get() {
      const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
      Object.defineProperty(this, styleName, { value: builder });
      return builder;
    }
  };
}
styles2.visible = {
  get() {
    const builder = createBuilder(this, this[STYLER], true);
    Object.defineProperty(this, "visible", { value: builder });
    return builder;
  }
};
var getModelAnsi = (model, level, type, ...arguments_) => {
  if (model === "rgb") {
    if (level === "ansi16m") {
      return ansi_styles_default[type].ansi16m(...arguments_);
    }
    if (level === "ansi256") {
      return ansi_styles_default[type].ansi256(ansi_styles_default.rgbToAnsi256(...arguments_));
    }
    return ansi_styles_default[type].ansi(ansi_styles_default.rgbToAnsi(...arguments_));
  }
  if (model === "hex") {
    return getModelAnsi("rgb", level, type, ...ansi_styles_default.hexToRgb(...arguments_));
  }
  return ansi_styles_default[type][model](...arguments_);
};
var usedModels = ["rgb", "hex", "ansi256"];
for (const model of usedModels) {
  styles2[model] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level], "color", ...arguments_), ansi_styles_default.color.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
  const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
  styles2[bgModel] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level], "bgColor", ...arguments_), ansi_styles_default.bgColor.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
}
var proto = Object.defineProperties(() => {
}, {
  ...styles2,
  level: {
    enumerable: true,
    get() {
      return this[GENERATOR].level;
    },
    set(level) {
      this[GENERATOR].level = level;
    }
  }
});
var createStyler = (open, close, parent) => {
  let openAll;
  let closeAll;
  if (parent === void 0) {
    openAll = open;
    closeAll = close;
  } else {
    openAll = parent.openAll + open;
    closeAll = close + parent.closeAll;
  }
  return {
    open,
    close,
    openAll,
    closeAll,
    parent
  };
};
var createBuilder = (self, _styler, _isEmpty) => {
  const builder = (...arguments_) => applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
  Object.setPrototypeOf(builder, proto);
  builder[GENERATOR] = self;
  builder[STYLER] = _styler;
  builder[IS_EMPTY] = _isEmpty;
  return builder;
};
var applyStyle = (self, string) => {
  if (self.level <= 0 || !string) {
    return self[IS_EMPTY] ? "" : string;
  }
  let styler = self[STYLER];
  if (styler === void 0) {
    return string;
  }
  const { openAll, closeAll } = styler;
  if (string.includes("\x1B")) {
    while (styler !== void 0) {
      string = stringReplaceAll(string, styler.close, styler.open);
      styler = styler.parent;
    }
  }
  const lfIndex = string.indexOf("\n");
  if (lfIndex !== -1) {
    string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
  }
  return openAll + string + closeAll;
};
Object.defineProperties(createChalk.prototype, styles2);
var chalk = createChalk();
var chalkStderr = createChalk({ level: stderrColor ? stderrColor.level : 0 });
var source_default = chalk;

// src/index.ts
var import_vite = require("vite");
var import_plugin_vue = __toESM(require("@vitejs/plugin-vue"), 1);
var import_plugin_basic_ssl = __toESM(require("@vitejs/plugin-basic-ssl"), 1);
var import_vite_plugin_mkcert = __toESM(require("vite-plugin-mkcert"), 1);
var import_vite2 = __toESM(require("@intlify/unplugin-vue-i18n/vite"), 1);
var import_rollup_plugin_visualizer = require("rollup-plugin-visualizer");
var import_vite_plugin_circular_dependency = __toESM(require("vite-plugin-circular-dependency"), 1);
var import_plugin_legacy = __toESM(require("@vitejs/plugin-legacy"), 1);
var import_vite_svg_loader = __toESM(require("vite-svg-loader"), 1);
var import_autoprefixer = __toESM(require("autoprefixer"), 1);
var import_vite_plugun_css_modules_dts = __toESM(require("@luban-ui/vite-plugun-css-modules-dts"), 1);
var import_vite_plugun_env_dts = __toESM(require("@luban-ui/vite-plugun-env-dts"), 1);
var import_vite_plugun_sitemap = __toESM(require("@luban-ui/vite-plugun-sitemap"), 1);

// src/utils/createClassNameHash.ts
var import_node_path = __toESM(require("path"), 1);
var import_node_crypto = __toESM(require("crypto"), 1);
var import_node_process2 = __toESM(require("process"), 1);
var hashMap = {};
function getUniqueName(content, p) {
  const hash = import_node_crypto.default.createHash("md5");
  hash.update(content);
  const hashText = hash.digest("hex").substring(0, 5);
  if (!hashMap[hashText]) {
    hashMap[hashText] = p;
    return hashText;
  }
  if (hashMap[hashText] === p)
    return hashText;
  return getUniqueName(`${content}~`, p);
}
function createClassNamehash(args) {
  const { root, name, filename, prefix, classCompress = true } = args;
  const p = `${import_node_path.default.relative(root, filename).replace(/\\/g, "/")}--${name}`;
  const basename = import_node_path.default.basename(filename).replace(/(\.module)?\.(css|less|scss)/, "").replace(/\./g, "_");
  const dirname = import_node_path.default.basename(import_node_path.default.dirname(filename));
  const content = `${prefix}:${p}`;
  const hash = getUniqueName(content, p);
  const cls = import_node_process2.default.env.NODE_ENV === "development" || !classCompress ? `${dirname}_${basename}_${name}__${hash}` : `${hash}`;
  return prefix ? `${prefix}${cls}` : cls;
}

// src/index.ts
var esTargetsDefault = [
  "es2015",
  "chrome87",
  "safari13",
  "firefox78",
  "edge88"
];
var modernTargetsDefault = [
  "defaults",
  "chrome >= 87",
  "safari >= 13",
  "firefox >= 78",
  "edge >= 88"
];
var legacyTargetsDefault = [
  "defaults",
  "chrome >= 87",
  "safari >= 13",
  "firefox >= 78",
  "edge >= 88",
  "android >= 7.1"
];
function viteLubanVuePlugin(opts = {}) {
  const root = opts.root ?? process3.cwd();
  const {
    esTargets = esTargetsDefault,
    modernTargets = modernTargetsDefault,
    legacyTargets = legacyTargetsDefault
  } = opts;
  const normalizePaths = (p) => {
    if (Array.isArray(p)) {
      return p.map((v) => {
        return normalizePaths(v);
      });
    }
    if (path2.isAbsolute(p))
      return p;
    return path2.resolve(root, p);
  };
  const lubanConfigPlugin = {
    name: "luban:config",
    async config(config, { mode }) {
      const confRoot = config.root || process3.cwd();
      const envPrefixSet = new Set(config.envPrefix ?? []);
      ["VITE_", "NODE_", "__VUE_", "__INTLIFY_"].forEach((v) => {
        envPrefixSet.add(v);
      });
      const envPrefix = [...envPrefixSet];
      const envDir = config.envDir ?? path2.resolve(confRoot, "./envs");
      const env2 = (0, import_vite.loadEnv)(mode, envDir, envPrefix);
      const base = config.base || "/";
      if (opts.verbose) {
        console.log(
          (0, import_autoprefixer.default)({
            overrideBrowserslist: [
              ...legacyTargetsDefault
            ]
          }).info()
        );
      }
      return {
        root: confRoot,
        base,
        envDir,
        envPrefix,
        define: {
          __VUE_PROD_DEVTOOLS__: env2["process.env.NODE_ENV"] === "development",
          __VUE_I18N_LEGACY_API_: false,
          __VUE_I18N_FULL_INSTALL__: false,
          __INTLIFY_PROD_DEVTOOLS__: false,
          ...config.define
        },
        resolve: {
          alias: {
            "vue-i18n": "vue-i18n/dist/vue-i18n.runtime.esm-bundler.js"
          }
        },
        server: {
          host: config.server?.host || "0.0.0.0"
        },
        css: {
          modules: {
            generateScopedName(name, filename) {
              return createClassNamehash({
                root,
                name,
                filename,
                prefix: "lb-",
                classCompress: true
              });
            }
          },
          postcss: {
            plugins: [
              (0, import_autoprefixer.default)({
                overrideBrowserslist: [
                  ...legacyTargetsDefault
                ]
              })
            ]
          }
        },
        build: {
          target: config.build?.target ?? esTargets
        },
        minify: config.build?.minify ?? "terser",
        rollupOptions: {
          maxParallelFileOps: config.build?.rollupOptions?.maxParallelFileOps ?? 5,
          output: {
            sourcemap: config.build?.rollupOptions?.output?.sourcemap ?? false,
            manualChunks: config.build?.rollupOptions?.output?.manualChunks ?? ((id) => {
              if (/node_modules\/(@vue|vue|vue-router|vue-i18n|@intlify|pinia|pinia-di)\//.test(
                id
              ))
                return "vue";
              if (/node_modules\/(@vee-validate\/rules|vee-validate)\//.test(id))
                return "validate";
              if (/node_modules\//.test(id))
                return "vendor";
            })
          }
        },
        experimental: {
          renderBuiltUrl(filename) {
            const ext = path2.extname(filename);
            const cndUrl = (opts.cdn?.url || "").replace(/\/$/, "");
            const pattern = opts.cdn?.assetsPattern || /\.(js|css|jpg|jpeg|png|gif|ico|svg|eot|woff|woff2|ttf|swf|mp3|mp4|wov|avi|flv|ogg|mpeg4|webm)$/;
            if (pattern.test(ext) && cndUrl) {
              return `${cndUrl}/${filename}`;
            }
            return { relative: true };
          }
        }
      };
    },
    configResolved: (conf) => {
      if (conf.root !== root) {
        console.log(source_default.red(`[@luban-ui/vite-plugin-vue] This plugin's root [${root}] is not match with vite's root [${conf.root}], the website may not run properly.`));
        console.log(source_default.red(`[@luban-ui/vite-plugin-vue] Please clearly pass the root parameter to this plugin and vite!`));
      }
    }
  };
  const plugins = [
    lubanConfigPlugin
  ];
  if (opts.cssModulesDts?.enable !== false) {
    plugins.push(
      (0, import_vite_plugun_css_modules_dts.default)(opts.cssModulesDts?.options)
    );
  }
  if (opts.envDts?.enable !== false) {
    plugins.push(
      (0, import_vite_plugun_env_dts.default)(opts.envDts?.options)
    );
  }
  if (opts.sitemap?.enable && opts.sitemap?.options) {
    plugins.push(
      (0, import_vite_plugun_sitemap.default)(opts.sitemap?.options)
    );
  }
  if (opts.vue?.enable !== false)
    plugins.push((0, import_plugin_vue.default)({
      ...opts.vue?.options
    }));
  if (opts.ssl?.enable !== false) {
    plugins.push((0, import_plugin_basic_ssl.default)());
  }
  if (opts.mkcert?.enable) {
    plugins.push((0, import_vite_plugin_mkcert.default)({
      source: "coding",
      ...opts.mkcert?.options
    }));
  }
  if (opts.svg?.enable !== false) {
    plugins.push(
      (0, import_vite_svg_loader.default)({
        defaultImport: "url",
        svgo: false,
        ...opts.svg?.options
      })
    );
  }
  if (opts.i18n?.enable !== false) {
    plugins.push(
      (0, import_vite2.default)({
        include: normalizePaths(
          "src/i18n/locales/**/*.json"
        ),
        ...opts.i18n?.options
      })
    );
  }
  if (opts.visualizer?.enable !== false) {
    plugins.push(
      (0, import_rollup_plugin_visualizer.visualizer)({
        emitFile: true,
        filename: "stats.html",
        ...opts.visualizer?.options
      })
    );
  }
  if (opts.circularDependency?.enable !== false) {
    plugins.push(
      (0, import_vite_plugin_circular_dependency.default)({
        exclude: /node_modules\//,
        ...opts.circularDependency?.options
      })
    );
  }
  if (opts.split?.enable !== false)
    plugins.push((0, import_vite.splitVendorChunkPlugin)());
  if (opts.legacy?.enable !== false) {
    plugins.push(
      (0, import_plugin_legacy.default)({
        targets: legacyTargets,
        modernPolyfills: true,
        modernTargets,
        ...opts.legacy?.options
      })
    );
  }
  return plugins;
}
var index_default = viteLubanVuePlugin;
