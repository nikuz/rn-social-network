'use strict';

import stylesGenerator from '../../../styles/generator';

export default stylesGenerator({
  content: {
    padding: 10
  },
  title: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC'
  },
  title_text: {
    fontSize: 18,
    color: '#333'
  },
  error: {
    marginBottom: 10
  },
  error_text: {
    color: '#F00',
    fontSize: 14
  }
});
