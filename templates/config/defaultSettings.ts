/** @format */

import {Settings as ProSettings} from '@ant-design/pro-layout';

type DefaultSettings = ProSettings & {
  pwa: boolean;
};

const proSettings: DefaultSettings = {
  navTheme: 'dark',
  primaryColor: '#ee4d2d',
  layout: 'sidemenu',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: true,
  },
  title: ' Admin',
  pwa: false,
  iconfontUrl: '',
};

export type {DefaultSettings};

export default proSettings;
