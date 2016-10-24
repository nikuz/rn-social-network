'use strict';

import stylesGenerator from '../../../../styles/generator';
import * as device from '../../../modules/device';

export default stylesGenerator({
  wrap: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  content: {
    flex: 1,
    paddingTop: 5
  },
  shadow_line: {
    top: device.isIos() ? 2 : 3
  },
  author_wrap: {
    padding: 5,
    flexDirection: 'row'
  },
  author_cont: {
    marginLeft: 8
  },
  author_name_wrap: {
    flex: 1
  },
  author_name: {
    color: '#333',
    fontSize: 14
  },
  posted_time: {
    fontSize: 11,
    color: '#999'
  },
  preview_container: {
    marginLeft: 5,
    marginRight: 5
  },
  description: {
    padding: 5
  },
  title: {
    padding: 5
  },
  title_text: {
    fontSize: 18,
    color: '#07D'
  },
  album_list_tongue_wrap: {
    overflow: 'hidden',
    position: 'absolute',
    top: device.isAndroid() ? 1 : 0,
    left: 0,
    right: 0,
    elevation: 2, // shadow on Android
    alignItems: 'center'
  },
  album_list_tongue: {
    height: 30,
    width: 70,
    marginTop: -15,
    paddingTop: 20,
    borderRadius: 20,
    backgroundColor: '#555'
  },
  album_list_tongue_cont: {
    alignItems: 'center'
  },
  album_list_tongue_line_sm: {
    width: 30,
    height: 2,
    marginBottom: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: '#333'
  },
  album_list_tongue_line: {
    width: 40,
    height: 3,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: '#333'
  },
  album_list: {
    position: 'relative',
    overflow: 'hidden',
    height: 1,
    backgroundColor: '#555'
  },
  album_list_item: {
    padding: 7,
    paddingLeft: 10,
    paddingRight: 10
  },
  album_list_item_current: {
    backgroundColor: '#666'
  },
  album_list_item_cont: {
    flexDirection: 'row'
  },
  album_list_item_text_wrap: {
    flex: 1,
    paddingLeft: 10,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center'
  },
  album_list_item_text_cont: {
    flex: 1
  },
  album_list_item_text: {
    color: '#FFF',
    fontSize: 14
  }
});
