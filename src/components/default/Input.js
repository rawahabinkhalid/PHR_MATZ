import React from 'react';
import { TextInput } from 'react-native';

export const Input = (props) => {
    const {
        placeholder, 
        placeholderTextColor,
        keyboardType,
        returnKeyType,
        blurOnSubmit,
        onChangeText,
        secureTextEntry,
        inputStyle,
        editable
    } = props;

    return(
        <TextInput 
        style={ inputStyle }
        placeholder = {placeholder}
        placeholderTextColor = {placeholderTextColor}
        keyboardType = {keyboardType}
        returnKeyType = {returnKeyType}
        blurOnSubmit = {blurOnSubmit}
        onChangeText = {onChangeText}
        secureTextEntry = {secureTextEntry}
        editable = {editable}/>
    );
}
