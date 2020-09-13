import { terser } from "rollup-plugin-terser";
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import path from 'path';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import clear from 'rollup-plugin-clear';
import kontra from 'rollup-plugin-kontra';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import copy from 'rollup-plugin-copy';

// dev build if watching, prod build if not
const production = !process.env.ROLLUP_WATCH;

const assets = [
  'assets/side_scroll_map.json',
  'assets/nature-paltformer-tileset-16x16.png',
  'assets/player.png',
  // 'assets/charset.png',
  'assets/sock-sheet.png',
  'assets/rotating_spike.png',
  // 'assets/rip.png',
  'assets/washing_machine.png',
];

let targets = assets.map(x => { return {src: x, dest: 'dist/assets'} });

export default {
  input: 'src/index.js',
  output: [
    {
      file: production ? "dist/main.min.js" : "dist/main.js",
      format: 'iife',
      sourcemap: production ? false : 'inline'
    },
  ],
  plugins: [
    // To import libs from node_modules
    resolve(),
    commonjs(),
    // contra rollup plugin
    kontra({
      gameObject: {
        // enable only velocity and rotation functionality
        velocity: true,
        ttl: true,
        camera: true,
        scale: true,
        anchor: true,
        group: true,
        opacity: true,
      },
      sprite: { animation: true }
    }),
    // To include css from scripts, combine and minimize
    postcss({
      minimize: production,
      extract: path.resolve (production ? 'dist/main.min.css' : 'dist/main.css')
    }),
    production && terser({
      ecma: 2020,
      module: true,
      toplevel: true,
      compress: {
        keep_fargs: false,
        passes: 10,
        pure_funcs: ['assert', 'debug'],
        pure_getters: true,
        unsafe: true,
        unsafe_arrows: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_methods: true,
        unsafe_symbols: true,
      },
      mangle: {
        properties: true,
      },
      output: {
        wrap_func_args: false,
      },
    }),
    // to use html template and include script and styles bundles
    htmlTemplate({
      template: 'src/index.html',
      target: production ? 'dist/index.dist.html' : 'dist/index.html',
    }),
    clear({
      // required, point out which directories should be clear.
      targets: ['dist'],
      // optional, whether clear the directories when rollup recompile on --watch mode.
      watch: true, // default: false
    }),
    copy({
      targets: targets,
    }),
    !production && serve({
      open: false,
      verbose: true,
      contentBase: ['dist'],
      port: 8080
    }),
    !production && livereload()
  ]
};
