'use strict';

import stylesGenerator from '../../../../styles/generator';

export default stylesGenerator({
  border: {
    margin: 10,
    marginBottom: 0,
    borderTopWidth: 1,
    borderTopColor: '#CCC'
  },
  content: {
    flexDirection: 'row'
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8
  },
  comments: {
    alignItems: 'flex-start',
    paddingLeft: 12
  },
  sharing_social: {
    flex: .8,
    paddingTop: 9
  },
  sharing: {
    flex: .8,
    paddingTop: 10
  },
  like: {
    paddingRight: 12,
    flex: .8,
    alignItems: 'flex-end'
  },
  separator: {
    flex: 1
  },
  icon: {
    fontSize: 18,
    color: '#c3c5c7',
    textAlignVertical: 'center'
  },
  text: {
    color: '#c3c5c7',
    fontSize: 14,
    textAlignVertical: 'center'
  },
  icon_active_color: {
    color: '#74a2d6'
  }
});
