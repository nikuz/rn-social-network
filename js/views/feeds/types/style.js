'use strict';

import stylesGenerator from '../../../../styles/generator';
import * as device from '../../../modules/device';

export default stylesGenerator({
  image_preview_container: {
    position: 'relative',
    marginLeft: 5,
    marginRight: 5,
    overflow: 'hidden',
    alignSelf: 'center'
  },
  video_duration: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    padding: 3,
    color: '#FFF',
    backgroundColor: 'transparent',
    fontSize: 15,
    textShadowColor: '#333',
    textShadowOffset: {
      width: 1,
      height: 1
    },
    textShadowRadius: 2
  },
  video_duration_sm: {
    right: 3,
    bottom: 3,
    fontSize: 12
  },
  video_icon_wrap: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    flexDirection: 'row',
    alignItems: 'center'
  },
  video_icon_cont: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center'
  },
  video_icon_bg: {
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: 'rgba(3, 3, 3, .3)'
  },
  video_icon_bg_sm: {
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10
  },
  video_icon: {
    fontSize: 40,
    color: '#FFF'
  },
  video_icon_sm: {
    fontSize: 25
  },
  image_touch_area: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    flexDirection: 'row'
  },
  album_counter_wrap: {
    backgroundColor: 'rgba(3, 3, 3, .4)',
    paddingTop: 5,
    width: 50
  },
  album_counter: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  news_pager_wrap: {
    padding: 7,
    flexDirection: 'row'
  },
  news_pager: {
    color: '#FFF',
    backgroundColor: 'transparent',
    fontSize: 15,
    textShadowColor: '#000',
    marginLeft: 5,
    textShadowOffset: {
      width: 1,
      height: 1
    },
    textShadowRadius: 2
  },
  news_pager_icon: {
    color: '#FFF',
    backgroundColor: 'transparent',
    fontSize: 15,
    marginTop: device.isIos() ? 1 : 3,
    textShadowColor: '#000',
    textShadowOffset: {
      width: 1,
      height: 1
    },
    textShadowRadius: 2
  },
  icon_wrap: {
    position: 'absolute',
    top: 5,
    right: 5
  },
  icon: {
    padding: 5,
    fontSize: 30,
    color: '#FFF',
    backgroundColor: 'transparent',
    textShadowColor: '#333',
    textShadowOffset: {
      width: 1,
      height: 1
    },
    textShadowRadius: 5
  }
});
