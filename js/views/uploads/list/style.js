'use strict';

import stylesGenerator from '../../../../styles/generator';

export default stylesGenerator({
  item: {
    padding: 15,
    margin: 10,
    marginTop: 12,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    backgroundColor: '#FAFAFA'
  },
  item_title: {
    marginBottom: 5,
    fontSize: 18,
    backgroundColor: 'transparent',
    color: '#000'
  },
  progress: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    marginTop: 15,
    height: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, .06)',
    borderRadius: 5
  },
  progress_completed: {
    height: 18,
    backgroundColor: '#00A8E6'
  },
  progress_remaining: {
    height: 18
  },
  item_icon: {
    position: 'absolute',
    right: 10,
    top: 10,
    color: '#DDD',
    fontSize: 36
  },
  item_file: {
    marginTop: 5,
    alignSelf: 'flex-start',
    paddingLeft: 4,
    paddingRight: 4,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 3
  },
  item_file_text: {
    color: '#D05',
    fontSize: 12
  },
  footer_loader: {
    marginTop: 10,
    marginBottom: 10
  }
});
