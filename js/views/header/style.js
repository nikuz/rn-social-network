'use strict';

import {StatusBar} from 'react-native';
import stylesGenerator from '../../../styles/generator';

export default stylesGenerator({
  ios_statusbar_bg: {
    height: StatusBar.currentHeight || 20,
    backgroundColor: '#c0bebe'
  },
  content: {
    flexDirection: 'row',
    height: 43,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#DFDFDF'
  },
  logo: {
    width: 42,
    height: 33
  },
  links: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 10,
    paddingTop: 6
  },
  link: {
    marginRight: 15,
    marginLeft: 5,
    color: '#000',
    fontSize: 14
  },
  content_item: {
    flexDirection: 'row'
  },
  content_item_icon: {
    width: 24,
    height: 24,
    marginTop: -2
  },
  icons: {
    flexDirection: 'row'
  },
  icon_wrap: {
    padding: 5
  },
  icon: {
    fontSize: 20,
    color: '#000'
  }
});
