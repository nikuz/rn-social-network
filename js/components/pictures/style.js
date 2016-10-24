'use strict';

import stylesGenerator from '../../../styles/generator';

export default stylesGenerator({
  avatar: {
    width: 36,
    height: 36
  },
  avatar_small: {
    width: 20,
    height: 20
  },
  avatar_large: {
    width: 60,
    height: 60
  },
  avatar_blank_wrap: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 36,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar_blank_wrap_small: {
    width: 20,
    height: 20
  },
  avatar_blank_wrap_large: {
    width: 60,
    height: 60
  },
  avatar_blank: {
    flex: 1,
    width: 36,
    textAlign: 'center',
    fontSize: 28,
    color: '#DDD'
  },
  avatar_blank_small: {
    fontSize: 18
  },
  avatar_blank_large: {
    fontSize: 60
  },
  image_loader_wrap: {
    position: 'absolute',
    left: 0,
    top: 0,
    flexDirection: 'row',
    alignItems: 'center'
  },
  image_loader: {
    flex: 1
  }
});
