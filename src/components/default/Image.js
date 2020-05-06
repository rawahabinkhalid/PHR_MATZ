import React from 'react';
import {Image} from 'react-native';

export const ImageView = (props) => {
    const {
        imageStyle,
        imgSource,
        resizeMode
    } = props;
    return( <Image style={imageStyle} source={imgSource} resizeMode={resizeMode} /> )
}