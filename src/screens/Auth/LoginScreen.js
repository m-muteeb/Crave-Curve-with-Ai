import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Validation Schema for Formik
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  // Handle User Login with MongoDB
  const handleLogin = async (values) => {
    const { email, password } = values;
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.post('http://192.168.100.16:5000/api/login', {
        email,
        password,
      });

      console.log('Login response:', response.data); // Log the entire response
      const { role } = response.data.user; // Get the role from the user object in the response

      if (role === 'customer') {
        console.log('Navigating to AllProducts');
        navigation.reset({
          index: 0,
          routes: [{ name: 'AllProducts' }],
        }); // Navigate to AllProducts screen for customers
      } else if (role === 'manager') {
        console.log('Navigating to SellerDashboardScreen');
        navigation.reset({
          index: 0,
          routes: [{ name: 'SellerDashboardScreen' }],
        }); // Navigate to SellerDashboardScreen for managers
      } else {
        console.log('Unknown role:', role);
      }
    } catch (error) {
      console.error('Error during login:', error.response || error.message);
      setErrorMessage(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' }} // Burger icon
          style={styles.logo}
        />
        <Text style={styles.appName}>Crave Curve</Text>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleLogin(values)}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              {/* Email Input */}
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#aaa"
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
              {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              {/* Password Input */}
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#aaa"
                secureTextEntry
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
              {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              {/* Login Button */}
              {loading ? (
                <ActivityIndicator size="large" color="#000" />
              ) : (
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSubmit}
                >
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
              )}

              {/* Error Message */}
              {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

              {/* Navigate to Register */}
              <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                <Text style={styles.registerText}>Don't have an account? Register here</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
  },
  input: {
    width: '90%',
    height: 50,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    width: '90%',
    height: 50,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    fontSize: 16,
    color: '#000',
    marginTop: 10,
  },
});

export default LoginScreen;