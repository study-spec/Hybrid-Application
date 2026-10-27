import { Stack, router } from 'expo-router';
import { useRef, useState } from 'react';
import { PasswordVisibilityIcon } from '../src/components/password-visibility-icon';
import { getLocalUser, isGmailAddress } from '../src/lib/local-auth';
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

type LoginResponse = {
  message?: string;
};

export default function HomeScreen() {
  const passwordInputRef = useRef<TextInput>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    if (!isGmailAddress(normalizedEmail)) {
      setError('Gunakan alamat email dengan domain @gmail.com.');
      return;
    }

    const loginEndpoint =
      Platform.OS === 'web'
        ? '/api/login'
        : API_BASE_URL
          ? `${API_BASE_URL}/api/login`
          : null;

    setError('');
    setIsSubmitting(true);

    try {
      if (!loginEndpoint) {
        const localUser = await getLocalUser();

        if (
          !localUser ||
          localUser.email !== normalizedEmail ||
          localUser.password !== password
        ) {
          throw new Error('Email atau password salah.');
        }

        router.replace('/home');
        return;
      }

      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      let responseBody: LoginResponse = {};
      try {
        responseBody = (await response.json()) as LoginResponse;
      } catch {
        // The API may return an empty body for an unsuccessful response.
      }

      if (!response.ok) {
        throw new Error(responseBody.message ?? 'Login gagal. Periksa kembali data Anda.');
      }

      router.replace('/home');
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Terjadi kesalahan saat login.',
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
      <Stack.Screen options={{ title: 'Login' }} />
      <ScrollView
        alwaysBounceVertical
        contentContainerStyle={styles.content}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        showsVerticalScrollIndicator
      >
        <View style={styles.form}>
          <Text style={styles.title}>Selamat datang</Text>
          <Text style={styles.subtitle}>Masuk untuk melanjutkan ke aplikasi.</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            editable={!isSubmitting}
            keyboardType="email-address"
            onChangeText={setEmail}
            onSubmitEditing={() => passwordInputRef.current?.focus()}
            placeholder="Masukkan email"
            placeholderTextColor="#8a94a6"
            returnKeyType="next"
            style={styles.input}
            textContentType="emailAddress"
            value={email}
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordField}>
            <TextInput
              ref={passwordInputRef}
              autoCapitalize="none"
              autoComplete="password"
              editable={!isSubmitting}
              onChangeText={setPassword}
              onSubmitEditing={() => void handleLogin()}
              placeholder="Masukkan password"
              placeholderTextColor="#8a94a6"
              returnKeyType="go"
              secureTextEntry={!isPasswordVisible}
              style={styles.passwordInput}
              textContentType="password"
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

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: isSubmitting }}
            disabled={isSubmitting}
            onPress={() => void handleLogin()}
            style={({ pressed }) => [
              styles.button,
              pressed && !isSubmitting ? styles.buttonPressed : null,
              isSubmitting ? styles.buttonDisabled : null,
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </Pressable>

          <Pressable onPress={() => router.push('/register')} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Belum punya akun? Daftar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 32,
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
    marginBottom: 20,
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
    marginBottom: 20,
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
    color: '#fff',
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
