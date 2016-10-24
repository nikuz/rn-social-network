'use strict';

import stylesGenerator from '../../../styles/generator';

export default stylesGenerator({
  item: {
    padding: 9,
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
    fontSize: 20,
    marginRight: 10,
    color: '#CCC'
  },
  separator: {
    height: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d',
    borderTopWidth: 1,
    borderTopColor: '#242424'
  }
});
