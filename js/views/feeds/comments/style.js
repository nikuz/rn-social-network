'use strict';

import stylesGenerator from '../../../../styles/generator';

export default stylesGenerator({
  separator: {
    borderTopWidth: 1,
    borderTopColor: '#EEE'
  },
  comment: {
    padding: 5,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row'
  },
  author_name: {
    color: '#000',
    fontSize: 14
  },
  comment_separator: {
    borderTopWidth: 1,
    borderTopColor: '#D9D9D9'
  },
  author_wrap: {
    padding: 5
  },
  comment_cont: {
    flex: 1,
    marginLeft: 3
  },
  like: {
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: 'row'
  },
  like_avatar: {
    marginRight: 8
  },
  like_text: {
    flex: 1,
    color: '#000',
    fontSize: 14
  },
  mention_text: {
    flex: 1,
    color: '#07D',
    fontSize: 14
  },
  posted_time_like: {
    marginTop: 3,
    fontSize: 11,
    color: '#999'
  },
  statistic: {
    flex: 1,
    paddingRight: 5,
    flexDirection: 'row'
  },
  posted_time: {
    marginTop: 3,
    flex: 1,
    fontSize: 11,
    color: '#999'
  },
  comment_stats_button: {
    marginTop: -1,
    padding: 3,
    paddingLeft: 7,
    paddingRight: 7,
    marginLeft: 3
  },
  comment_stats_icon: {
    fontSize: 14,
    color: '#c3c5c7'
  },
  comment_stats_loading: {
    marginTop: -10
  },
  comment_stats_error: {
    marginTop: -10
  },
  comment_stats_icon_liked: {
    color: '#74a2d6'
  },
  text_editor_wrap: {
    margin: 5,
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 5
  },
  footer_loader: {
    marginTop: 10,
    marginBottom: 10
  },
  action_overlay_item: {
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15
  },
  action_overlay_text: {
    fontSize: 18,
    color: '#000'
  },
  removedCommentText: {
    color: '#999'
  },
  error_marker_icon: {
    color: '#F00',
    fontSize: 18
  }
});
