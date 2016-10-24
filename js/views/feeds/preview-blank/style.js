'use strict';

import stylesGenerator from '../../../../styles/generator';

export default stylesGenerator({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#FFF'
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
