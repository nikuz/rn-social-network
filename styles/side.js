'use strict';

import {StatusBar} from 'react-native';
import stylesGenerator from './generator';

export default stylesGenerator({
  wrap: {
    flex: 1,
    backgroundColor: '#333'
  },
  title: {
    padding: 5,
    paddingLeft: 15,
    paddingTop: (StatusBar.currentHeight || 20) + 5,
    backgroundColor: '#404040'
  },
  title_h2: {
    padding: 5,
    paddingLeft: 15,
    backgroundColor: '#404040'
  },
  title_text: {
    color: '#777',
    fontSize: 14
  }
});
