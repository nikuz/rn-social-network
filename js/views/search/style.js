'use strict';

import stylesGenerator from '../../../styles/generator';
import * as device from '../../modules/device';

export default stylesGenerator({
  field_wrap: {
    marginTop: 10
  },
  field: {
    height: device.isAndroid() ? 40 : 35,
    margin: 10,
    padding: 0,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    backgroundColor: device.isAndroid() ? '#EEE' : '#FFF',
    borderRadius: 5,
    fontSize: 15,
    color: '#333'
  },
  field_loading: {
    position: 'absolute',
    right: 18,
    top: device.isAndroid() ? 22 : 18
  },
  result_rows: {
    flexDirection: 'row'
  },
  users_list: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#DDD'
  },
  posts_list: {
    flex: 3
  },
  item: {
    padding: 7,
    paddingLeft: 10,
    paddingRight: 10
  },
  item_cont: {
    flexDirection: 'row'
  },
  item_text_wrap: {
    flex: 1,
    paddingLeft: 10
  },
  item_text: {
    color: '#333',
    fontSize: 14
  },
  item_user: {
    padding: 7,
    marginBottom: 5,
    alignItems: 'center'
  },
  item_user_text_wrap: {
    paddingTop: 5
  },
  item_user_text: {
    textAlign: 'center',
    fontSize: 14
  },
  empty_result: {
    padding: 10
  },
  empty_result_text: {
    textAlign: 'center',
    fontSize: 14
  },
  more: {
    padding: 10,
    backgroundColor: '#555',
    alignItems: 'center'
  },
  more_cont: {
    flexDirection: 'row'
  },
  more_text: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18
  },
  more_icon: {
    marginRight: 10,
    fontSize: 20,
    color: '#FFF'
  }
});
