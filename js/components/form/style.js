'use strict';

import stylesGenerator from '../../../styles/generator';
import * as device from '../../modules/device';

export default stylesGenerator({
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
  multiline_field: {
    height: 70
  },
  attach_wrap: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 10
  },
  attach_cont: {
    flex: 1
  },
  attach: {
    width: 64,
    marginRight: 15
  },
  link: {
    marginTop: 5,
    marginBottom: 10,
    paddingTop: 5,
    paddingBottom: 5
  },
  link_text: {
    color: '#07D',
    fontSize: 14
  },
  plain_text: {
    color: '#000',
    fontSize: 14
  },
  captcha: {
    marginBottom: 10
  },
  field_loading: {
    position: 'absolute',
    right: 8,
    top: 18
  },
  field_error: {
    padding: 10,
    paddingTop: 7,
    paddingBottom: 7,
    borderRadius: 5,
    backgroundColor: '#fff1f0',
    borderWidth: 1,
    borderColor: '#f3c1b7'
  },
  field_error_text: {
    color: '#d85030',
    fontSize: 14
  },
  field_warning: {
    backgroundColor: '#fffceb',
    borderColor: '#f6d8b0'
  },
  field_warning_text: {
    color: '#e28327',
    fontSize: 14
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
  buttons_container: {
    flexDirection: 'row'
  },
  button_separator: {
    width: 10,
    height: 10
  }
});
