'use strict';

import stylesGenerator from '../../../styles/generator';

export default stylesGenerator({
  container: {
    position: 'absolute',
    top: -100,
    right: 0,
    left: 0,
    elevation: 2,
    backgroundColor: '#000'
  },
  visible: {
    top: 0,
    bottom: 0
  },
  pan: {
    position: 'absolute',
    left: 0,
    top: 0,
    elevation: 3,
    backgroundColor: 'transparent'
  },
  batchTape: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    flexDirection: 'row'
  },
  picture_wrap: {
    flex: 1,
    position: 'relative'
  },
  picture_container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: 'row'
  },
  picture_container_inner: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center'
  },
  cover: {
    position: 'absolute',
    left: 0,
    top: 0
  },
  picture_content: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flexDirection: 'row'
  },
  picture_content_inner: {
    flex: 1,
    alignSelf: 'center'
  },
  picture_loading: {
    alignItems: 'center'
  },
  picture_error: {
    flex: 1,
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: 'center',
    backgroundColor: 'rgba(43, 51, 63, .3)'
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
  error_container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: 'row'
  },
  error_content: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: 'rgba(43, 51, 63, .5)'
  },
  error_text: {
    color: '#FFF',
    fontSize: 14
  },
  icon_wrap: {
    alignItems: 'center',
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'rgba(43, 51, 63, .5)'
  },
  icon: {
    fontSize: 36,
    color: '#FFF',
    backgroundColor: 'transparent'
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
});
