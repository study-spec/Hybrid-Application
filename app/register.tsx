import { Stack, router } from 'expo-router';
import { useRef, useState } from 'react';
import { PasswordVisibilityIcon } from '../src/components/password-visibility-icon';
import {
  hasPasswordRequirements,
  isGmailAddress,
  saveLocalUser,
} from '../src/lib/local-auth';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

type RegisterResponse = {
  message?: string;
};

export default function RegisterScreen() {
  const usernameInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister() {
    const normalizedEmail = email.trim();
    const normalizedUsername = username.trim();

    if (!normalizedEmail || !normalizedUsername || !password || !confirmPassword) {
      setError('Semua field wajib diisi.');
      return;
    }

    if (!isGmailAddress(normalizedEmail)) {
      setError('Gunakan alamat email dengan domain @gmail.com.');
      return;
    }

    if (!hasPasswordRequirements(password)) {
      setError('Password minimal 8 karakter, harus mengandung angka, dan 1 karakter unik.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak sama.');
      return;
    }

    const registerEndpoint =
      Platform.OS === 'web'
        ? '/api/register'
        : API_BASE_URL
          ? `${API_BASE_URL}/api/register`
          : null;

    setError('');
    setIsSubmitting(true);

    try {
      if (!registerEndpoint) {
        await saveLocalUser({
          email: normalizedEmail,
          username: normalizedUsername,
          password,
        });
        router.replace('/home');
        return;
      }

      const response = await fetch(registerEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          username: normalizedUsername,
          password,
        }),
      });

      let responseBody: RegisterResponse = {};
      try {
        responseBody = (await response.json()) as RegisterResponse;
      } catch {
        // The API may return an empty body for an unsuccessful response.
      }

      if (!response.ok) {
        throw new Error(responseBody.message ?? 'Registrasi gagal.');
      }

      router.replace('/home');
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Terjadi kesalahan saat registrasi.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Stack.Screen options={{ title: 'Register' }} />
      <ScrollView
        alwaysBounceVertical
        contentContainerStyle={styles.content}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        showsVerticalScrollIndicator
      >
        <View style={styles.form}>
          <Text style={styles.title}>Buat akun</Text>
          <Text style={styles.subtitle}>Daftar untuk mulai menggunakan aplikasi.</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            editable={!isSubmitting}
            keyboardType="email-address"
            onChangeText={setEmail}
            onSubmitEditing={() => usernameInputRef.current?.focus()}
            placeholder="Masukkan email"
            placeholderTextColor="#8a94a6"
            returnKeyType="next"
            style={styles.input}
            textContentType="emailAddress"
            value={email}
          />

          <Text style={styles.label}>Username</Text>
          <TextInput
            ref={usernameInputRef}
            autoCapitalize="none"
            autoComplete="username"
            autoCorrect={false}
            editable={!isSubmitting}
            onChangeText={setUsername}
            onSubmitEditing={() => passwordInputRef.current?.focus()}
            placeholder="Masukkan username"
            placeholderTextColor="#8a94a6"
            returnKeyType="next"
            style={styles.input}
            textContentType="username"
            value={username}
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordField}>
            <TextInput
              ref={passwordInputRef}
              autoCapitalize="none"
              autoComplete="new-password"
              editable={!isSubmitting}
              onChangeText={setPassword}
              onSubmitEditing={() => void handleRegister()}
              placeholder="Masukkan password"
              placeholderTextColor="#8a94a6"
              returnKeyType="next"
              secureTextEntry={!isPasswordVisible}
              style={styles.passwordInput}
              textContentType="newPassword"
              value={password}
            />
            <Pressable
              accessibilityLabel={isPasswordVisible ? 'Sembunyikan password' : 'Tampilkan password'}
              accessibilityRole="button"
              accessibilityState={{ selected: isPasswordVisible }}
              onPress={() => setIsPasswordVisible((visible) => !visible)}
              style={styles.visibilityButton}
            >
              <PasswordVisibilityIcon visible={isPasswordVisible} />
            </Pressable>
          </View>

          <Text style={styles.label}>Konfirmasi password</Text>
          <View style={styles.passwordField}>
            <TextInput
              autoCapitalize="none"
              autoComplete="new-password"
              editable={!isSubmitting}
              onChangeText={setConfirmPassword}
              onSubmitEditing={() => void handleRegister()}
              placeholder="Ulangi password"
              placeholderTextColor="#8a94a6"
              returnKeyType="go"
              secureTextEntry={!isConfirmPasswordVisible}
              style={styles.passwordInput}
              textContentType="newPassword"
              value={confirmPassword}
            />
            <Pressable
              accessibilityLabel={isConfirmPasswordVisible ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'}
              accessibilityRole="button"
              accessibilityState={{ selected: isConfirmPasswordVisible }}
              onPress={() => setIsConfirmPasswordVisible((visible) => !visible)}
              style={styles.visibilityButton}
            >
              <PasswordVisibilityIcon visible={isConfirmPasswordVisible} />
            </Pressable>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: isSubmitting }}
            disabled={isSubmitting}
            onPress={() => void handleRegister()}
            style={({ pressed }) => [
              styles.button,
              pressed && !isSubmitting ? styles.buttonPressed : null,
              isSubmitting ? styles.buttonDisabled : null,
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </Pressable>

          <Pressable onPress={() => router.replace('/login')} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Sudah punya akun? Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingBottom: 48,
    width: '100%',
  },
  form: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 420,
  },
  title: {
    color: '#172033',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#667085',
    fontSize: 16,
    marginBottom: 28,
  },
  label: {
    color: '#344054',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#d0d5dd',
    borderRadius: 10,
    borderWidth: 1,
    color: '#172033',
    fontSize: 16,
    marginBottom: 18,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  passwordField: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#d0d5dd',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 18,
  },
  passwordInput: {
    color: '#172033',
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  visibilityButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  error: {
    color: '#b42318',
    fontSize: 14,
    marginBottom: 16,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 10,
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    alignItems: 'center',
    marginTop: 20,
    padding: 8,
  },
  secondaryButtonText: {
    color: '#2563eb',
    fontSize: 15,
    fontWeight: '600',
  },
});
