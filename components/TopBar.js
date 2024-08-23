import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';

const { width } = Dimensions.get('screen');

export default function TopBar({ navigation }) {

  const goSettings = () => {
    navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'SettingsScreen' }],
        })
      );
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Text style={styles.textBold}>Metrix</Text>
        <Text style={styles.textBold}> AI</Text>
        {/* <Image source={require('../assets/logoMetrixAItransparent.png')} style={styles.logo} /> */}
      </View>
      <View style={styles.rightContainer}>
        <FontAwesome
          onPress={goSettings}
          style={styles.icon}
          name="gear"
          size={30}
          color="#001F3F"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 0,
    paddingHorizontal: 15,
    // backgroundColor: '#0C1020',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5.46,
    elevation: 9,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBold: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#001F3F',
  },
  textBoldHighlight: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#FFFFFF', // Text color
    marginLeft: 5,
    textShadowColor: '#001F3F', // Outline color
    textShadowOffset: { width: -1, height: 1 }, // Shadow offset
    textShadowRadius: 1, // Shadow radius
  },
  logo: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 20,
  },
});

