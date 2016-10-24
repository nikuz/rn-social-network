'use strict';

import stylesGenerator from '../../../styles/generator';
import * as device from '../../modules/device';

export default stylesGenerator({
  title: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center'
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
  },
  picker_wrap: {
    alignItems: 'center'
  },
  picker: {
    color: '#333',
    height: 40,
    padding: 0,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: device.isAndroid() ? '#EEE' : '#FFF'
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: device.isAndroid() ? 20 : 19,
    fontSize: 18,
    color: '#666'
  },
  blocker: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  buttons: {
    flexDirection: 'row'
  },
  button_separator: {
    width: 10,
    height: 10
  }
});
