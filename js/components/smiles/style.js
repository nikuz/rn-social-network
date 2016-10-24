'use strict';

import stylesGenerator from '../../../styles/generator';

export default stylesGenerator({
  wrap: {
    height: 150
  },
  cont: {
    padding: 10,
    paddingBottom: 0
  },
  row: {
    flexDirection: 'row'
  },
  item: {
    flex: 1,
    alignItems: 'center',
    width: 70,
    height: 50
  }
});
