'use strict';

import stylesGenerator from '../../../../styles/generator';
import * as device from '../../../modules/device';

export default stylesGenerator({
  button: {
    padding: 10,
    paddingRight: 15
  },
  button_icon: {
    fontSize: 20,
    color: '#000'
  },
  embed_fields_wrap: {
    flexDirection: 'row'
  },
  embed_field: {
    width: 100,
    height: device.isAndroid() ? 40 : 35,
    marginTop: 10,
    marginBottom: 10,
    padding: 0,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    backgroundColor: device.isAndroid() ? '#EEE' : '#FFF',
    borderRadius: 5,
    fontSize: 15,
    color: '#333'
  },
  embed_fields_separator: {
    margin: 10,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center'
  },
  embed_fields_separator_text: {
    fontSize: 15
  },
  switcher_wrap: {
    paddingTop: 13,
    paddingBottom: 13
  },
  switcher_cont: {
    flexDirection: 'row'
  },
  switcher_text: {
    flex: 1,
    marginTop: device.isIos() ? 5 : 0,
    marginLeft: 10,
    fontSize: 18,
    color: '#000'
  },
  dlist_item: {
    padding: 10
  },
  dlist_cont: {
    flexDirection: 'row'
  },
  dlist_icon: {
    fontSize: 20,
    color: '#000'
  },
  dlist_text: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#000'
  },
  embedded: {
    padding: 10,
    paddingLeft: 35,
    marginBottom: 10,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    overflow: 'hidden',
    backgroundColor: '#DFDFDF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#CCC'
  },
  embedded_text: {
    color: '#333',
    fontSize: 14
  },
  clipboard_icon: {
    position: 'absolute',
    top: 10,
    left: 10,
    fontSize: 20,
    color: '#333',
    backgroundColor: 'transparent'
  },
  clipboard_message: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(33, 33, 33, .6)'
  },
  clipboard_message_text: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 14
  },
  dropdown_item: {
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10
  },
  dropdown_item_text: {
    fontSize: 18,
    color: '#CCC'
  }
});
