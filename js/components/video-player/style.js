'use strict';

import stylesGenerator from '../../../styles/generator';

export default stylesGenerator({
  container: {
    height: 200,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  error_container: {
    height: 200,
    flexDirection: 'row',
    backgroundColor: '#000'
  },
  error_wrap: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    paddingTop: 50
  },
  error_text: {
    color: '#FFF',
    fontSize: 14
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  pause_container: {
    flexDirection: 'row',
    elevation: 2
  },
  pause: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center'
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
  loader_wrap: {
    padding: 5,
    backgroundColor: 'rgba(43, 51, 63, .5)'
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
  controls_wrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  controls_tape: {
    backgroundColor: 'rgba(43, 51, 63, .5)'
  },
  controls: {
    flexDirection: 'row'
  },
  progress: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 1,
    overflow: 'hidden',
    marginLeft: 5,
    padding: 5,
    paddingTop: 14,
    paddingBottom: 13
  },
  progressCompleted: {
    height: 3,
    backgroundColor: '#FFF'
  },
  progressRemaining: {
    height: 3,
    backgroundColor: 'rgba(115, 133, 159, .5)'
  },
  progressPoint: {
    position: 'absolute',
    top: 11.5,
    left: 0,
    width: 8,
    height: 8,
    backgroundColor: '#FFF',
    borderRadius: 8
  },
  time: {
    width: 50,
    paddingTop: 7,
    paddingLeft: 7
  },
  time_long: {
    width: 68
  },
  time_text: {
    fontSize: 12,
    color: '#FFF'
  },
  controls_button: {
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 10
  },
  controls_icon: {
    color: '#FFF',
    fontSize: 18
  },
  quality_tooltip: {
    position: 'absolute',
    right: 5,
    bottom: 35,
    backgroundColor: '#EEE',
    elevation: 2,
    shadowColor: '#333',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    }
  },
  qt_item: {
    flexDirection: 'row',
    width: 70,
    padding: 2,
    paddingLeft: 5,
    paddingRight: 5
  },
  qt_item_text: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
    color: '#1f1f1f'
  },
  qt_item_icon: {
    paddingRight: 5,
    fontSize: 16,
    color: '#1f1f1f'
  },
  fs_container: {
    position: 'absolute',
    top: -100,
    right: 0,
    left: 0,
    elevation: 2,
    backgroundColor: '#000'
  },
  fs_visible: {
    top: 0,
    bottom: 0
  }
});
