/** @format */

import {defineConfig} from 'umi';
import * as path from 'path';

import routes from './routes';

const {REACT_APP_ENV, ENV = 'test', CID = 'id', APP} = process.env;

const isLive = ENV === 'live';
let SENTRY_RELEASE = '';

try {
  SENTRY_RELEASE = require('child_process')
    .execSync('git rev-parse HEAD')
    .toString()
    .trim();
} catch (error) {}

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  define: {
    'process.env': {
      ENV,
      CID,
      APP,
      SENTRY_RELEASE,
    },
  },
  // 非正式环境不上报 sentry，不需要生成 sourcemap
  devtool: isLive ? 'hidden-source-map' : false,
  locale: {
    // default zh-CN
    default: 'en-US',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },

  targets: {
    ie: isLive ? 11 : false,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: getRoutes({
    routes,
  }),
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...lightTheme,
    'primary-color': settings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],

  chainWebpack(memo) {
    memo.module
      .rule('csv')
      .test(/\.(csv)$/)
      .include.add(require('path').join(__dirname, '../src/assets'))
      .end()
      .use('csv')
      .loader('csv-loader');

    // 避免 worker script 报 warning
    // https://github.com/GoogleChromeLabs/worker-plugin/issues/20#issuecomment-465188755
    memo.output.globalObject("(typeof self!='undefined'?self:global)");

    return memo;
  },
  esbuild: {},
  nodeModulesTransform: !isLive && {
    type: 'none',
    exclude: [],
  },
});
