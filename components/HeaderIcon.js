import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
// components
import Store from './Store';
// assets
import smile from '../assets/images/smile.png';
import frown from '../assets/images/frown.png';

const HeaderIcon = () => {
    return (
       <Store.Consumer>
           {({showSmile}) => (
            <View style={styles.headerWrapper}>
                {showSmile ? <Image source={smile}></Image> : <Image source={frown}></Image>}
            </View>
            )}
       </Store.Consumer>
    )
}

const styles = StyleSheet.create({
    headerWrapper: {
        width: '100%',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 30
    },
  });

export default HeaderIcon;