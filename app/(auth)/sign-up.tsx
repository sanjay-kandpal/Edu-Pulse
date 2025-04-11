import * as React from 'react'
import { 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter, Link } from 'expo-router'

// Ghibli-inspired theme constants
const COLORS = {
  primary: '#4695CB',     // Ghibli Sky Blue
  secondary: '#6C9D70',   // Ghibli Forest Green
  accent: '#E8934A',      // Ghibli Warm Orange
  background: '#F7F2E8',  // Soft Cream Background
  text: '#43464B',        // Deep Charcoal
  textLight: '#ffffff',
  inputBg: 'rgba(255, 255, 255, 0.7)',
  border: 'rgba(70, 149, 203, 0.5)',
  error: '#E74C3C',
};

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return
    
    setIsLoading(true)
    setError('')

    // Validate inputs
    if (!emailAddress.trim()) {
      setError('Please enter your email address')
      setIsLoading(false)
      return
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      setIsLoading(false)
      return
    }

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
      setError('')
    } catch (err) {
      // Handle sign-up errors
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message || 'An error occurred during sign up')
      } else {
        setError('Failed to create account. Please try again.')
      }
      console.error(JSON.stringify(err, null, 2))
    } finally {
      setIsLoading(false)
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return
    
    setIsLoading(true)
    setError('')

    if (!code.trim()) {
      setError('Please enter the verification code')
      setIsLoading(false)
      return
    }

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        setError('Verification incomplete. Please try again.')
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // Handle verification errors
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message || 'Verification failed')
      } else {
        setError('Invalid verification code. Please try again.')
      }
      console.error(JSON.stringify(err, null, 2))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.formContainer}>
          {/* Decorative elements */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />
          <View style={styles.decorCircle3} />
          
          {pendingVerification ? (
            <>
              <View style={styles.headerContainer}>
                <Text style={styles.header}>Verify Your Email</Text>
                <Text style={styles.subHeader}>Enter the code we sent to your email</Text>
              </View>
              
              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Verification Code</Text>
                <TextInput
                  style={styles.input}
                  value={code}
                  placeholder="Enter the 6-digit code"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  onChangeText={(code) => setCode(code)}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>
              
              <TouchableOpacity 
                style={styles.button} 
                onPress={onVerifyPress}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.textLight} />
                ) : (
                  <Text style={styles.buttonText}>Verify Email</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.resendButton}
                onPress={async () => {
                  try {
                    await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
                    setError('New code has been sent to your email')
                  } catch (err) {
                    setError('Failed to resend code. Try again later.')
                  }
                }}
              >
                <Text style={styles.resendText}>Resend Code</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.headerContainer}>
                <Text style={styles.header}>Join the Adventure</Text>
                <Text style={styles.subHeader}>Create your account to begin</Text>
              </View>
              
              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  onChangeText={(email) => setEmailAddress(email)}
                  keyboardType="email-address"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  placeholder="Create a password (min. 8 characters)"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  secureTextEntry={true}
                  onChangeText={(password) => setPassword(password)}
                />
              </View>
              
              <TouchableOpacity 
                style={styles.button} 
                onPress={onSignUpPress}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.textLight} />
                ) : (
                  <Text style={styles.buttonText}>Create Account</Text>
                )}
              </TouchableOpacity>
              
              <View style={styles.linkContainer}>
                <Text style={styles.linkText}>Already have an account?</Text>
                <Link href="/(auth)/sign-in" asChild>
                  <TouchableOpacity>
                    <Text style={styles.linkAction}>Sign in</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'relative',
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
    textAlign: 'center',
  },
  errorContainer: {
    width: '100%',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.text,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  button: {
    backgroundColor: COLORS.primary,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  resendButton: {
    marginTop: 10,
    padding: 10,
  },
  resendText: {
    color: COLORS.primary,
    fontSize: 14,
    textDecorationLine: 'underline',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  linkContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: COLORS.text,
    marginRight: 5,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  linkAction: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  // Decorative elements to mimic Ghibli style
  decorCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(70, 149, 203, 0.1)',
    top: -50,
    right: -50,
    zIndex: -1,
  },
  decorCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(108, 157, 112, 0.1)',
    bottom: -30,
    left: -30,
    zIndex: -1,
  },
  decorCircle3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(232, 147, 74, 0.1)',
    top: '40%',
    left: '15%',
    zIndex: -1,
  },
});