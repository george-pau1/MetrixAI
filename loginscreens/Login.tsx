import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { signInWithEmailAndPassword, setPersistence } from 'firebase/auth';
import { auth } from '../config/firebase'; // Adjust the import path as needed
import { EmailContext } from '../contexts/EmailContext'; // Update the path as necessary
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const { setEmail } = useContext(EmailContext);
  const [form, setForm] = useState({
    email: '',
    password: '',
    error: '',
  });

  const storeUserData = async (value: string) => {
    try {
      await AsyncStorage.setItem('user', value);
    } catch (error) {
      console.warn(error);
    }
  };

  const storePasswordData = async (value: string) => {
    try {
      await AsyncStorage.setItem('password', value);
    } catch (error) {
      console.warn(error);
    }
  };

  const getData = async () => {
    try {
      const email = await AsyncStorage.getItem('user');
      const password = await AsyncStorage.getItem('password');
      if (email && password) {
        setForm({ email, password, error: '' });
      }
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleLogin = async () => {
    if (form.email === '' || form.password === '') {
      setForm({ ...form, error: 'Email and password are mandatory.' });
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      setEmail(form.email);
      
      await storeUserData(form.email); // Store user email upon successful login
      await storePasswordData(form.password); // Store the password
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'LoginLoading' }],
        })
      );
    } catch (error) {
      setForm({ ...form, error: (error as Error).message });
    }
  };

  const navigateToSignUp = () => {
    navigation.navigate('SignUp');
    console.log("Move to Sign Up")
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image
            alt="App Logo"
            resizeMode="contain"
            style={styles.headerImg}
            source={require('../assets/logoMetrixAItransparent.png')}
          />
          <Text style={styles.title}>
            Metrix<Text style={styles.highlightText}>AI</Text>
          </Text>
          <Text style={styles.subtitle}>The AI Calorie Tracker</Text>
        </View>
        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Email address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#AAB8C2" style={styles.inputIcon} />
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                keyboardType="email-address"
                onChangeText={email => setForm({ ...form, email })}
                placeholder="john@example.com"
                placeholderTextColor="#AAB8C2"
                style={styles.inputControl}
                value={form.email}
              />
            </View>
          </View>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#AAB8C2" style={styles.inputIcon} />
              <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={password => setForm({ ...form, password })}
                placeholder="********"
                placeholderTextColor="#AAB8C2"
                style={styles.inputControl}
                secureTextEntry={true}
                value={form.password}
              />
            </View>
          </View>
          {form.error ? <Text style={styles.errorText}>Incorrect Password</Text> : null}
          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleLogin}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Sign in</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <TouchableOpacity onPress={navigateToSignUp} style={styles.formFooterContainer}>
        <Text style={styles.formFooter}>
          Don't have an account? <Text style={styles.formFooterLink}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginVertical: 18,
  },
  headerImg: {
    width: 140,
    height: 140,
    marginBottom: 24,
    // transform: [{ rotate: '-25deg' }],
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#001F3F',
    marginBottom: 8,
  },
  highlightText: {
    color: '#001F3F',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#001F3F',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#001F3F',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#001F3F',
  },
  inputIcon: {
    marginRight: 8,
  },
  inputControl: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#001F3F',
  },
  formAction: {
    marginTop: 24,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 14,
    backgroundColor: '#001F3F',
    shadowColor: '#001F3F',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
  },
  btnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#001F3F',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  formFooterContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  formFooter: {
    fontSize: 16,
    fontWeight: '600',
    color: '#001F3F',
    textAlign: 'center',
  },
  formFooterLink: {
    color: '#001F3F',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 10,
  },
});
