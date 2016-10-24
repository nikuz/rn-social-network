'use strict';

import stylesGenerator from './generator';

export default stylesGenerator({
  wrap: {
    flex: 1,
    backgroundColor: '#e3e4e6'
  },
  wrap_white: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  content: {
    flex: 1,
    margin: 5,
    marginTop: 8,
    padding: 10,
    backgroundColor: '#FFF'
  },
  isTop: {
    paddingTop: 0
  },
  shadow_line: {
    position: 'absolute',
    top: 2,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#FFF',
    elevation: 2, // shadow on Android
    shadowColor: '#333',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    }
  },
  loader: {
    marginTop: 25
  },
  footer_loader: {
    marginTop: 10,
    marginBottom: 10
  },
  loader_wrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  loader_cont: {
    flex: 1,
    alignItems: 'center'
  },
  error_wrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  error_cont: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center'
  },
  error_text: {
    marginTop: 10,
    marginBottom: 5,
    color: '#F66',
    textAlign: 'center',
    fontSize: 14
  }
});
