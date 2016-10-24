'use strict';

import stylesGenerator from '../../../../styles/generator';

export default stylesGenerator({
  container: {
    position: 'absolute',
    top: -100,
    right: 0,
    left: 0,
    elevation: 2,
    backgroundColor: '#000',
    flexDirection: 'row'
  },
  visible: {
    top: 0,
    bottom: 0
  },
  content: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center'
  },
  title: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 20,
    paddingBottom: 5,
    backgroundColor: 'rgba(43, 51, 63, .3)'
  },
  title_back_button: {
    position: 'absolute',
    top: 20,
    left: 0,
    paddingLeft: 10,
    paddingRight: 10
  },
  title_back_button_icon: {
    fontSize: 20,
    color: '#FFF'
  },
  title_text: {
    marginTop: -1,
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    color: '#FFF',
    textShadowColor: '#333',
    textShadowOffset: {
      width: 1,
      height: 1
    },
    textShadowRadius: 2
  },
  error_content: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    padding: 5
  },
  error_text: {
    color: '#FFF',
    fontSize: 14
  },
  icon: {
    fontSize: 36,
    color: '#FFF',
    backgroundColor: 'transparent'
  }
});
