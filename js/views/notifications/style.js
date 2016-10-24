'use strict';

import stylesGenerator from '../../../styles/generator';

export default stylesGenerator({
  item_wrap: {
    borderBottomWidth: 1,
    borderBottomColor: '#DDD'
  },
  item: {
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row'
  },
  item_cont: {
    flex: 1,
    marginLeft: 8
  },
  item_header: {
    flex: 1,
    flexDirection: 'row'
  },
  item_title: {
    flex: 2,
    marginBottom: 2,
    fontSize: 18,
    color: '#000'
  },
  posted_time: {
    flex: 1,
    marginTop: 4,
    fontSize: 12,
    textAlign: 'right',
    color: '#999'
  },
  footer_loader: {
    marginTop: 10,
    marginBottom: 10
  }
});
