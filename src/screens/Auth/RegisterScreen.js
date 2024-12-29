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

const RegisterScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Validation Schema for Formik
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  // Handle User Registration with MongoDB
  const handleRegister = async (values) => {
    const { email, password } = values;
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.post('http://172.16.50.211:5000/api/register', {
        email,
        password,
        role,
      });

      console.log(response.data.message); // Registration success message
      setRegistrationSuccess(true);
      setTimeout(() => {
        navigation.navigate('LoginScreen');
      }, 2000);
    } catch (error) {
      console.error('Error during registration:', error.response || error.message);
      setErrorMessage(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/869/869636.png' }} // New event logo
          style={styles.logo}
        />
        <Text style={styles.appName}>Eventify</Text>

        <Formik
          initialValues={{ email: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleRegister(values)}
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
                placeholder="Create a password"
                placeholderTextColor="#aaa"
                secureTextEntry
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
              {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              {/* Confirm Password Input */}
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#aaa"
                secureTextEntry
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                value={values.confirmPassword}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}

              {/* Role Selection */}
              <Text style={styles.label}>Register as:</Text>
              <View style={styles.roleContainer}>
                {['Attendee', 'Organizer'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.radioButton,
                      role === option.toLowerCase() && styles.selectedRadioButton,
                    ]}
                    onPress={() => setRole(option.toLowerCase())}
                  >
                    <Text
                      style={[
                        styles.radioText,
                        role === option.toLowerCase() && styles.selectedRadioText,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {!role && <Text style={styles.errorText}>Please select a role</Text>}

              {/* Register Button */}
              {loading ? (
                <ActivityIndicator size="large" color="#008CBA" />
              ) : (
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSubmit}
                >
                  <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
              )}

              {/* Error Message */}
              {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

              {/* Navigate to Login */}
              <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={styles.loginText}>Already have an account? Login here</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>

        {/* Success Message */}
        {registrationSuccess && (
          <View style={styles.successMessage}>
            <Text style={styles.successText}>Welcome to Eventify, {role}!</Text>
          </View>
        )}
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
    color: '#008CBA',
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
  label: {
    fontSize: 18,
    color: '#333',
    marginVertical: 10,
    alignSelf: 'flex-start',
    marginLeft: '5%',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 20,
  },
  radioButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  selectedRadioButton: {
    backgroundColor: '#008CBA',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  selectedRadioText: {
    color: '#fff',
  },
  button: {
    width: '90%',
    height: 50,
    backgroundColor: '#008CBA',
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
  loginText: {
    fontSize: 16,
    color: '#008CBA',
    marginTop: 10,
  },
  successMessage: {
    backgroundColor: '#008CBA',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  successText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;