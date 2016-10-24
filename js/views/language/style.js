'use strict';

import stylesGenerator from '../../../styles/generator';

export default stylesGenerator({
  item: {
    padding: 5,
    paddingLeft: 15,
    paddingRight: 10
  },
  item_cont: {
    flexDirection: 'row'
  },
  item_text: {
    flex: 1,
    marginTop: 2,
    color: '#CCC',
    fontSize: 14
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10
  },
  current_icon: {
    marginTop: 2,
    fontSize: 18,
    color: '#ccc'
  },
  separator: {
    height: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d',
    borderTopWidth: 1,
    borderTopColor: '#242424'
  }
});
