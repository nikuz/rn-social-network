'use strict';

import stylesGenerator from '../../../styles/generator';
import * as device from '../../modules/device';

export default stylesGenerator({
  wrap: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    elevation: 2
  },
  suggest: {
    position: 'absolute',
    marginTop: 2,
    marginLeft: 3,
    backgroundColor: '#FFF',
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
    left: 0
  },
  loader: {
    position: 'absolute',
    right: 8,
    top: 18
  },
  item: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 6,
    paddingRight: 6
  },
  item_text: {
    color: '#000',
    fontSize: 14
  },
  field: {
    height: device.isAndroid() ? 40 : 35,
    marginTop: 10,
    marginBottom: 10,
    padding: 0,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    fontSize: 15,
    backgroundColor: device.isAndroid() ? '#EEE' : '#FFF',
    textAlignVertical: 'center',
    color: '#333'
  }
});
