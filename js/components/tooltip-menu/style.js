'use strict';

import stylesGenerator from '../../../styles/generator';

export default stylesGenerator({
  wrap: {
    position: 'absolute',
    top: -100,
    right: 0,
    left: 0,
    elevation: 2
  },
  centering: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  visible: {
    top: 0,
    bottom: 0
  },
  menu: {
    position: 'absolute',
    width: 160,
    marginTop: 2,
    marginLeft: 3,
    backgroundColor: '#333',
    elevation: 3, // shadow on Android
    shadowColor: '#333',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    }
  },
  touch_area: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(3, 3, 3, .3)'
  },
  touch_area_transparent: {
    backgroundColor: 'transparent'
  }
});
