'use strict';

import stylesGenerator from '../../../styles/generator';

export default stylesGenerator({
  container: {
    position: 'relative',
    height: 64,
    backgroundColor: '#232323'
  },
  player: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0
  },
  progress: {
    height: 64,
    marginLeft: 64,
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden'
  },
  progressCompleted: {
    height: 64,
    backgroundColor: '#0082b2'
  },
  progressRemaining: {
    height: 64
  },
  buttons: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 64,
    height: 64
  },
  controllers: {
    position: 'absolute',
    left: 64,
    top: 0,
    right: 0,
    height: 64,
    backgroundColor: 'transparent',
    flexDirection: 'row'
  },
  button: {
    width: 64,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00aef6'
  },
  button_cont: {
    flex: 1,
    alignItems: 'center'
  },
  icon: {
    color: '#FFF',
    fontSize: 20
  },
  icon_error: {
    fontSize: 30,
    color: '#F8E0E0'
  },
  name: {
    flex: 1,
    paddingLeft: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  duration: {
    paddingRight: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  loading_wrap: {
    width: 64,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00aef6'
  },
  loading_cont: {
    flex: 1,
    alignItems: 'center'
  },
  text: {
    color: '#FFF',
    fontSize: 20
  }
});
