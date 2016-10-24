'use strict';

import stylesGenerator from '../../../styles/generator';
import * as device from '../../modules/device';

export default stylesGenerator({
  wrap: {
    flexDirection: 'row'
  },
  button: {
    marginTop: 5,
    padding: 8,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 3
  },
  stretched: {
    flex: 1,
    alignItems: 'center'
  },
  green: {
    backgroundColor: '#5BBC2E'
  },
  gray: {
    backgroundColor: '#CCC'
  },
  blue: {
    backgroundColor: '#00A7E5'
  },
  red: {
    backgroundColor: '#DA314B'
  },
  button_cont: {
    flexDirection: 'row'
  },
  text: {
    color: '#FFF',
    fontSize: 15
  },
  icon: {
    marginTop: device.isAndroid() ? 1 : 0,
    marginRight: 8,
    color: '#FFF',
    fontSize: 18
  },
  loader: {
    marginLeft: 10,
    marginTop: 3,
    alignSelf: 'center'
  }
});
