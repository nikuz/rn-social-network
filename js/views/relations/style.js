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
  item_title: {
    marginBottom: 2,
    fontSize: 18,
    color: '#000'
  },
  location: {
    flexDirection: 'row',
    marginBottom: 4
  },
  location_icon: {
    width: 14,
    height: 14,
    marginTop: 1
  },
  location_text: {
    marginLeft: 3,
    fontSize: 13,
    color: '#444'
  },
  footer_loader: {
    marginTop: 10,
    marginBottom: 10
  }
});
