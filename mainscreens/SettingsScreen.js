import React, { useContext } from 'react';
import { View, StyleSheet, Alert, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { Avatar, Title, Paragraph, List, Divider, Switch, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CommonActions } from '@react-navigation/native';
import { EmailContext } from '../contexts/EmailContext';
import { getAuth, deleteUser } from "firebase/auth";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SettingsScreen = ({ navigation }) => {

  const { globalemail } = useContext(EmailContext);
  const auth = getAuth();
  const user = auth.currentUser;

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => {
          deleteUser(user).then(() => {
            console.log('Account deleted');
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'SignUp' }],
              })
            );
          }).catch((error) => {
            console.error('Error deleting user:', error);
            Alert.alert("Error", "There was an error deleting your account. Please try again later.");
          });
        }}
      ]
    );
  };

  const goBack = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'HomeScreen' }],
      })
    );
  };

  return (
    <ScrollView style={styles.container}>

      <List.Section style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <MaterialIcons name="arrow-back" size={24} color="#001F3F" />
        </TouchableOpacity>
        <List.Subheader>Account: {globalemail}</List.Subheader>
        <List.Item
          title="Privacy Policy"
          left={() => <List.Icon icon="file-document-outline" color="#001F3F" />}
          onPress={() => Linking.openURL('https://metrixaiapp.com/privacy-policy')}
        />
        <List.Item
          title="Terms of Service"
          left={() => <List.Icon icon="file-document-outline" color="#001F3F" />}
          onPress={() => Linking.openURL('https://metrixaiapp.com/terms-of-service')}
        />
        <List.Item
          title="Delete Account"
          left={() => <List.Icon icon="delete-outline" color="#001F3F" />}
          titleStyle={{ color: 'red' }}
          onPress={handleDeleteAccount}
        />
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 70,
  },
  title: {
    fontSize: 24,
    marginVertical: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
  },
  divider: {
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#001F3F',
    color: '#ffffff'
  }
});

export default SettingsScreen;
