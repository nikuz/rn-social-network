'use strict';

import stylesGenerator from '../../styles/generator';

export default stylesGenerator({
  loader_wrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  loader_cont: {
    flex: 1,
    alignItems: 'center'
  },
  loader: {
    marginTop: 10
  },
  error_wrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  error_cont: {
    flex: 1,
    alignItems: 'center'
  },
  error_text: {
    marginTop: 10,
    fontSize: 14
  },
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  blocker: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  side_menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#333'
  },
  navigator: {
    flex: 1,
    paddingTop: 37
  }
});
