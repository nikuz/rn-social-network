'use strict';

import stylesGenerator from '../../../../styles/generator';

export default stylesGenerator({
  wrap: {
    overflow: 'hidden',
    backgroundColor: '#FFF',
    margin: 5,
    marginTop: 8,
    marginBottom: 2
  },
  author_wrap: {
    padding: 5,
    flexDirection: 'row'
  },
  author_name_wrap: {
    flex: 1,
    marginLeft: 8
  },
  names_wrap: {
    flex: 1,
    marginBottom: 2
  },
  author_name: {
    color: '#333',
    fontSize: 14
  },
  parent_author_name: {
    color: '#07D',
    fontSize: 14
  },
  posted_time: {
    fontSize: 11,
    color: '#999'
  },
  compact_layout_preview_wrap: {
    flexDirection: 'row'
  },
  compact_layout_title_wrap: {
    flex: 1,
    marginLeft: 5
  },
  title: {
    padding: 5
  },
  title_text: {
    fontSize: 18,
    color: '#07D'
  },
  description: {
    padding: 5
  },
  user_content: {
    padding: 5
  },
  user_text: {
    marginBottom: 10
  },
  user_location: {
    flexDirection: 'row',
    marginBottom: 4
  },
  user_location_icon: {
    width: 24,
    height: 24,
    marginTop: -2
  },
  user_location_text: {
    marginLeft: 5,
    fontSize: 15
  }
});
