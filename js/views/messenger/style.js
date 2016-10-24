'use strict';

import stylesGenerator from '../../../styles/generator';

export default stylesGenerator({
  wrap: {
    transform: [
      { scaleY: -1 }
    ]
  },
  content: {
    padding: 5,
    paddingTop: 15,
    paddingBottom: 15
  },
  item_wrap: {
    marginBottom: 13,
    flexDirection: 'row',
    transform: [
      { scaleY: -1 }
    ]
  },
  message: {
    flex: 1,
    padding: 8,
    marginLeft: 5,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#B2CFDD',
    backgroundColor: '#EBF7FD',
    borderRadius: 5
  },
  message_me: {
    borderColor: '#DDD',
    backgroundColor: '#FAFAFA'
  },
  message_removed: {
    borderColor: '#EEE',
    backgroundColor: '#FFF'
  },
  message_text: {
    color: '#2d7091',
    fontSize: 15
  },
  message_me_text: {
    color: '#444'
  },
  message_text_removed: {
    color: '#999'
  },
  avatar: {
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5
  },
  message_time: {
    marginTop: 4,
    fontSize: 12,
    color: '#999'
  },
  editor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#DADADA'
  },
  action_overlay_item: {
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15
  },
  action_overlay_text: {
    fontSize: 18,
    color: '#000'
  },
  error_marker: {
    padding: 5,
    alignItems: 'center'
  },
  error_marker_icon: {
    color: '#F00',
    fontSize: 18
  },
  empty_icon: {
    fontSize: 150,
    color: '#EEE'
  }
});
