'use strict';

import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import * as _ from 'underscore';
import * as config from '../../config';
import styles from './style';

const smilesList = [
  {
    url: 'smiley-pope-35x32.png',
    width: 35,
    height: 32,
    code: '[pope]'
  },
  {
    url: 'smiley-cardinal-46x31.png',
    width: 46,
    height: 31,
    code: '[cardinal]'
  },
  {
    url: 'smiley-camillo-41x38.png',
    width: 41,
    height: 38,
    code: '[camillo]'
  },
  {
    url: 'smiley-swiss-50x44.png',
    width: 50,
    height: 44,
    code: '[swiss]'
  },
  {
    url: 'smiley-monksmile-30x28.png',
    width: 30,
    height: 28,
    code: '[monksmile]'
  },
  {
    url: 'smiley-monksmoke-36x32.png',
    width: 36,
    height: 32,
    code: '[monksmoke]'
  },
  {
    url: 'smiley-monkschreib-39x30.png',
    width: 39,
    height: 30,
    code: '[monkschreib]'
  },
  {
    url: 'smiley-monksean-29x29.png',
    width: 29,
    height: 29,
    code: '[monksean]'
  },
  {
    url: 'smiley-monknick-29x28.png',
    width: 29,
    height: 28,
    code: '[monknick]'
  },
  {
    url: 'smiley-monkroll-29x27.png',
    width: 29,
    height: 27,
    code: '[monkroll]'
  },
  {
    url: 'smiley-monktacet-35x29.png',
    width: 35,
    height: 29,
    code: '[monktacet]'
  },
  {
    url: 'smiley-monktock-41x28.png',
    width: 41,
    height: 28,
    code: '[monktock]'
  },
  {
    url: 'smiley-monkuiuiui-38x28.png',
    width: 38,
    height: 28,
    code: '[monkuiuiui]'
  },
  {
    url: 'smiley-monkwine-35x32.png',
    width: 35,
    height: 32,
    code: '[monkwine]'
  },
  {
    url: 'smiley-monkkotz-34x32.png',
    width: 34,
    height: 32,
    code: '[monkkotz]'
  },
  {
    url: 'smiley-monkfaint-30x28.png',
    width: 30,
    height: 28,
    code: '[monkfaint]'
  },
  {
    url: 'smiley-monksilas-29x28.png',
    width: 29,
    height: 28,
    code: '[monksilas]'
  },
  {
    url: 'smiley-nunny-33x28.png',
    width: 33,
    height: 28,
    code: '[nunny]'
  },
  {
    url: 'smiley-nunkiss-33x28.png',
    width: 33,
    height: 28,
    code: '[nunkiss]'
  },
  {
    url: 'smiley-nuncoffee-45x29.png',
    width: 45,
    height: 29,
    code: '[nuncoffee]'
  },
  {
    url: 'smiley-nunsmoke-44x30.png',
    width: 44,
    height: 30,
    code: '[nunsmoke]'
  },
  {
    url: 'smiley-nuncool-34x29.png',
    width: 34,
    height: 29,
    code: '[nuncool]'
  },
  {
    url: 'smiley-nunroll-33x28.png',
    width: 33,
    height: 28,
    code: '[nunroll]'
  },
  {
    url: 'smiley-nungrins-33x28.png',
    width: 33,
    height: 28,
    code: '[nungrins]'
  },
  {
    url: 'smiley-nunmagistra-34x28.png',
    width: 34,
    height: 28,
    code: '[nunmagistra]'
  },
  {
    url: 'smiley-nunmotz-48x32.png',
    width: 48,
    height: 32,
    code: '[nunmotz]'
  },
  {
    url: 'smiley-nunrazz-52x29.png',
    width: 52,
    height: 29,
    code: '[nunrazz]'
  },
  {
    url: 'smiley-nunbrow-35x29.png',
    width: 35,
    height: 29,
    code: '[nunbrow]'
  },
  {
    url: 'smiley-nunrosary-49x30.png',
    width: 49,
    height: 30,
    code: '[nunrosary]'
  },
  {
    url: 'smiley-nunapplause-39x31.png',
    width: 39,
    height: 31,
    code: '[nunapplause]'
  },
  {
    url: 'smiley-nunnovice-34x30.png',
    width: 34,
    height: 30,
    code: '[nunnovice]'
  },
  {
    url: 'smiley-beffchen-33x30.png',
    width: 33,
    height: 30,
    code: '[beffchen]'
  }
];

class Smiles extends Component {
  static propTypes = {
    onPress: React.PropTypes.func.isRequired
  };
  state = {
    smileWidth: 70,
    dataSource: []
  };
  onLayout = (e) => {
    if (this.state.dataSource.length) {
      return;
    }

    var layout = e.nativeEvent.layout,
      itemsPerRow = Math.floor(layout.width / this.state.smileWidth),
      dataSource = [],
      smileIndex = 0;

    for (let i = 0, l = Math.ceil(smilesList.length / itemsPerRow); i < l; i += 1) {
      let row = [];
      for (let j = 0; j < itemsPerRow; j += 1) {
        if (smilesList[smileIndex]) {
          row.push(smilesList[smileIndex]);
        } else {
          row.push({
            empty: true
          });
        }
        smileIndex += 1;
      }
      dataSource.push(row);
    }
    this.setState({
      dataSource
    });
  };
  onPress = (item) => {
    this.props.onPress(item);
  };
  render() {
    return (
      <ScrollView style={styles.wrap} showsVerticalScrollIndicator={true}>
        <View style={styles.cont} onLayout={this.onLayout}>
          {_.map(this.state.dataSource, (row, rowKey) => {
            return (
              <View key={'row_' + rowKey} style={styles.row}>
                {_.map(row, (item, key) => {
                  if (item.empty) {
                    return (
                      <View key={rowKey + key} style={styles.item} />
                    );
                  } else {
                    var url = `${config.API_URL}/image/${item.url}`,
                      size = {
                        width: item.width,
                        height: item.height
                      };

                    return (
                      <TouchableOpacity
                        key={rowKey + key}
                        style={styles.item}
                        onPress={this.onPress.bind(this, item)}
                      >
                        <Image
                          source={{uri: url}}
                          style={size}
                        />
                      </TouchableOpacity>
                    );
                  }
                })}
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }
}

export {
  smilesList,
  Smiles
};
