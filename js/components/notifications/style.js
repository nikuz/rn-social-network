'use strict';

import stylesGenerator from '../../../styles/generator';

export default stylesGenerator({
  wrap: {
    marginTop: 5,
    marginBottom: 5,
    padding: 10,
    paddingTop: 5,
    paddingBottom: 7,
    paddingRight: 30,
    borderWidth: 1,
    borderColor: 'rgba(101, 159, 19, .3)',
    borderRadius: 3,
    backgroundColor: '#f2fae3'
  },
  wrap_error: {
    borderColor: 'rgba(216, 80, 48, .3)',
    backgroundColor: '#fff1f0'
  },
  close: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 6,
    paddingTop: 4
  },
  close_text: {
    fontSize: 15,
    color: '#659f13'
  },
  close_text_error: {
    color: '#D85030'
  },
  text: {
    color: '#659f13',
    fontSize: 14
  },
  text_error: {
    color: '#d85030'
  }
});
