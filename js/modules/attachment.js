'use strict';

import {
  NativeModules
} from 'react-native';
import * as _ from 'underscore';

const ImagePickerManager = NativeModules.ImagePickerManager;

function get(options, callback) {
  var opts = _.extend({
    title: '',
    cancelButtonTitle: 'Cancel',
    takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
    chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
    cameraType: 'back', // 'front' or 'back'
    mediaType: 'photo', // 'photo' or 'video'
    videoQuality: 'low', // 'low', 'medium', or 'high'
    durationLimit: 10, // video recording max time in seconds
    maxWidth: 1920, // photos only
    maxHeight: 1080, // photos only
    aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
    aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
    quality: 0.8, // 0 to 1, photos only
    angle: 0, // android only, photos only
    allowsEditing: false, // Built in functionality to resize/reposition the image after selection
    noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
    storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
      skipBackup: true, // ios only - image will NOT be backed up to icloud
      path: 'images' // ios only - will save image at /Documents/images rather than the root
    }
  }, options);
  var cb = callback || _.noop;

  ImagePickerManager.showImagePicker(opts, (response) => {
    // response:
    // {
    //   uri: '',
    //   data: '', // You can display the image using this base64 string
    //   height: 0,
    //   width: 0,
    //   isVertical: false
    // }
    if (response.didCancel) {
      cb(null, null);
    } else if (response.error) {
      cb(response.error);
    } else if (response.customButton) {
      cb(null, {
        customPressed: response.customButton
      });
    } else {
      response.name = response.uri.match(/[^/]+$/)[0];
      cb(null, response);
    }
  });
}

export {
  get
};
