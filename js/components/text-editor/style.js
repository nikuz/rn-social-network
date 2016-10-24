'use strict';

import stylesGenerator from '../../../styles/generator';
import * as device from '../../modules/device';

export default stylesGenerator({
  content: {
    flexDirection: 'row'
  },
  field_wrap: {
    flex: 1
  },
  field : {
    height: 50,
    backgroundColor: '#FFF',
    padding: 0,
    paddingLeft: 10,
    fontSize: 18,
    color: '#333'
  },
  field_big: {
    height: device.isAndroid() ? 80 : 70,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    backgroundColor: device.isAndroid() ? '#EEE' : '#FFF',
    borderRadius: 5,
    fontSize: 15
  },
  transparent: {
    backgroundColor: 'transparent'
  },
  smile_button: {
    width: 35,
    paddingTop: 12,
    paddingRight: 10,
    alignItems: 'flex-end',
    backgroundColor: 'transparent'
  },
  smile_button_overlay: {
    position: 'absolute',
    top: 5,
    right: 0
  },
  smile_button_icon: {
    fontSize: 24,
    color: '#b4b7bb'
  },
  smile_button_icon_active: {
    color: '#5181b8'
  },
  send_button: {
    width: 40,
    paddingTop: 10,
    paddingRight: 15,
    alignItems: 'flex-end'
  },
  send_button_icon: {
    fontSize: 24,
    color: '#5181b8',
    transform: [{
      rotate: '30deg'
    }]
  },
  loading_wrap: {
    width: 40,
    paddingTop: 14,
    paddingRight: 15,
    alignItems: 'flex-end'
  },
  smiles_wrap: {
    borderBottomWidth: 1,
    borderBottomColor: '#DADADA'
  },
  smiles_wrap_tooltip: {
    position: 'absolute',
    top: 0,
    right: 40,
    backgroundColor: '#FFF',
    elevation: 3, // shadow on Android
    shadowColor: '#333',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    }
  }
});
