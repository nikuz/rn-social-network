'use strict';

import stylesGenerator from './generator';

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
  },
  loader: {
    padding: 10
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#CCC'
  },
  tab: {
    padding: 10,
    paddingTop: 12
  },
  tab_active: {
    paddingTop: 10
  },
  tab_text: {
    fontSize: 14,
    color: '#AAA'
  },
  tab_text_active: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  }
});
