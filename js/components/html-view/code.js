'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Linking
} from 'react-native';
import * as _ from 'underscore';
import entities from 'he';
import * as config from '../../config';
import * as postsHelpers from '../../modules/posts';
import * as device from '../../modules/device';
import * as browser from '../../modules/browser';
import {Picture} from '../pictures/code';
import styles from './style';

const IMAGES_IN_LINKS_REG = /<a\b[^>]*?>[^<]*?(<img\b[^>]*?>)[^<]*?<\/a>/ig;
const TAGS_REG = /<(a|img|br)\b[^>]*\/?>(((.|\n)*?)<\/\1>)?/ig;
const TAG_FIRST_PART_REG = /<([a-zA-Z0-9]+)\b[^>]*\/?>/g;
const TAG_LAST_PART_REG = /<\/[a-zA-Z0-9]+>/g;
const TAG_NAME_REG = /^<([a-zA-Z0-9]+)/;
const TAG_PROPS_REG = /([a-zA-Z0-9]+)=["'](.*?)["']/g;
const TAG_PROP_REG = /=["']/;
const QUOTES_REG = /("|')/g;

function getTagProps(tag) {
  var tagFirstPart = tag.match(TAG_FIRST_PART_REG)[0],
    tagProps = tagFirstPart.match(TAG_PROPS_REG),
    props = {};

  _.each(tagProps, function(propItem) {
    propItem = propItem.split(TAG_PROP_REG);
    props[propItem[0]] = entities.decode(
      propItem[1].replace(QUOTES_REG, '')
    );
  });
  return props;
}

function getRawText(content) {
  return entities.decode(
    content
      .replace(TAG_FIRST_PART_REG, '')
      .replace(TAG_LAST_PART_REG, '')
  );
}

function parse(options) {
  var opts = options,
    HTML = opts.value || '',
    dimensions = device.staticDimensions(),
    tags,
    result = [],
    textStyle = [styles.text, opts.textStyle];

  HTML = HTML.replace(IMAGES_IN_LINKS_REG, '$1');
  tags = HTML.match(TAGS_REG);

  if (tags) {
    let textParagraph = [];
    _.each(tags, function(tagItem, key) {
      var HTMLPiece = HTML.split(tagItem, 1)[0],
        tagName = tagItem.match(TAG_NAME_REG)[1],
        tagProps = getTagProps(tagItem),
        textBefore,
        component,
        blockImageInserted;

      if (HTMLPiece.length) {
        textBefore = (
          <Text
            key={key + '_'}
            style={textStyle}
          >
            {getRawText(HTMLPiece)}
          </Text>
        );
      } else {
        textBefore = null;
      }

      switch(tagName.toLowerCase()) {
        case 'a': {
          let linkRawText = getRawText(tagItem);
          component = (
            <Text
              key={key}
              onPress={opts.onLinkPress.bind(null, tagProps.href, linkRawText)}
              style={[styles.a, opts.linkStyle]}
            >
              {linkRawText}
            </Text>
          );
          break;
        }
        case 'img': {
          let size = postsHelpers.getImageActualSize({
              width: Number(tagProps.width),
              height: Number(tagProps.height),
              targetWidth: dimensions.width - 20,
              targetHeight: dimensions.height
            }),
            url = entities.decode(tagProps.src);

          if (url.indexOf('http') !== 0) {
            url = config.API_URL + url;
          }
          if (opts.inline) {
            component = (
              <Image
                key={key}
                source={{uri: url}}
                style={size}
              />
            );
          } else {
            component = (
              <TouchableOpacity
                key={key}
                onPress={opts.onImagePress.bind(null, tagProps)}
                style={styles.image}
              >
                <Picture
                  url={url}
                  width={size.width}
                  height={size.height}
                />
              </TouchableOpacity>
            );
          }
          textParagraph.push(textBefore);
          result.push(<Text key={`${key}_paragraph`}>{textParagraph}</Text>);
          textParagraph = [];
          result.push(component);
          blockImageInserted = true;
          break;
        }
        case 'br':
          component = <Text key={key}>{'\n'}</Text>;
          break;
      }

      if (!blockImageInserted) {
        textParagraph.push(
          textBefore,
          component
        );
      }

      HTML = HTML.replace(HTMLPiece, '').replace(tagItem, '');
    });
    if (HTML.length) {
      textParagraph.push(
        <Text key={1000} style={textStyle}>{getRawText(HTML)}</Text>
      );
    }
    if (textParagraph.length) {
      result.push(<Text key={1001} style={textStyle}>{textParagraph}</Text>);
    }
  } else {
    result.push(
      <Text key={1} style={textStyle}>{getRawText(HTML)}</Text>
    );
  }
  return result;
}

class HTMLView extends Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    onLinkPress: React.PropTypes.func,
    onImagePress: React.PropTypes.func,
    inline: React.PropTypes.bool
  };
  state = {
    result: null
  };
  onLinkPress = (url) => {
    browser.openURL(url);
  };
  onImagePress = (url) => {
    console.log(url);
  };
  parse = (props) => {
    props = Object.create(props);
    if (!props.onLinkPress) {
      props.onLinkPress = this.onLinkPress;
    }
    if (!props.onImagePress) {
      props.onImagePress = this.onImagePress;
    }
    this.setState({
      result: parse(props)
    });
  };
  componentWillMount() {
    this.parse(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.parse(nextProps);
  }
  render() {
    var props = this.props;
    if (this.state.result) {
      if (props.inline) {
        return (
          <Text>
            {this.state.result}
          </Text>
        );
      } else {
        return (
          <View>
            {this.state.result}
          </View>
        );
      }
    } else {
      return null;
    }
  }
}

export default HTMLView;
