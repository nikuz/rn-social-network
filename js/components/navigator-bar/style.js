'use strict';

import stylesGenerator from '../../../styles/generator';
import * as device from '../../modules/device';

export default stylesGenerator({
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#FFF'
  },
  navbar_animated: {
    position: 'absolute',
    top: 0,
    height: 40,
    backgroundColor: 'transparent'
  },
  left_button_container: {
    position: 'absolute',
    left: 0,
    top: 0
  },
  left_button: {
    padding: 10
  },
  left_button_icon: {
    fontSize: 20,
    color: '#000'
  },
  right_button_container: {
    position: 'absolute',
    right: 0,
    top: 0
  },
  title: {
    padding: 10,
    paddingTop: device.isAndroid() ? 7 : 9,
    alignSelf: 'center'
  },
  prev_title: {
    position: 'absolute',
    left: 0,
    right: 0
  },
  title_text: {
    fontSize: 17,
    color: '#000',
    textAlign: device.isIos() ? 'center' : 'left'
  },
  menu_icon: {
    fontSize: 17,
    color: '#000'
  },
  dropdown_menu_item: {
    flexDirection: 'row',
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10
  },
  dropdown_menu_item_text: {
    flex: 1,
    fontSize: 18,
    color: '#CCC'
  },
  dropdown_menu_cur_icon: {
    marginTop: 4,
    marginLeft: 5,
    fontSize: 15,
    color: '#CCC'
  }
});
