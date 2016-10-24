'use strict';

import stylesGenerator from '../../../styles/generator';

export default stylesGenerator({
  wrap: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center'
  },
  content: {
    backgroundColor: '#FFF'
  },
  touch_area: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(3, 3, 3, .5)'
  },
  close: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 35,
    height: 35,
    paddingTop: 5,
    paddingRight: 5,
    alignItems: 'flex-end',
    backgroundColor: 'transparent'
  },
  close_icon: {
    fontSize: 20,
    color: '#333'
  }
});
