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
      className="flex-1 items-center justify-center bg-[#f7f9fc]"
    >
      <Stack.Screen options={{ title: 'Login' }} />
      <ScrollView
        alwaysBounceVertical
        contentContainerClassName="w-full grow justify-center px-6 pb-12 pt-6"
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        showsVerticalScrollIndicator
      >
        <View className="w-full max-w-[420px] self-center">
          <Text className="mb-2 text-[30px] font-bold text-[#172033]">Selamat datang</Text>
          <Text className="mb-8 text-base text-[#667085]">
            Masuk untuk melanjutkan ke aplikasi.
          </Text>

          <Text className="mb-2 text-sm font-semibold text-[#344054]">Email</Text>
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
            className="mb-5 rounded-[10px] border border-[#d0d5dd] bg-white px-[14px] py-[13px] text-base text-[#172033]"
            textContentType="emailAddress"
            value={email}
          />

          <Text className="mb-2 text-sm font-semibold text-[#344054]">Password</Text>
          <View className="mb-5 flex-row items-center rounded-[10px] border border-[#d0d5dd] bg-white">
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
              className="flex-1 px-[14px] py-[13px] text-base text-[#172033]"
              textContentType="password"
              value={password}
            />
            <Pressable
              accessibilityLabel={isPasswordVisible ? 'Sembunyikan password' : 'Tampilkan password'}
              accessibilityRole="button"
              accessibilityState={{ selected: isPasswordVisible }}
              onPress={() => setIsPasswordVisible((visible) => !visible)}
              className="px-3 py-3"
            >
              <PasswordVisibilityIcon visible={isPasswordVisible} />
            </Pressable>
          </View>

          {error ? <Text className="mb-4 text-sm text-[#b42318]">{error}</Text> : null}

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: isSubmitting }}
            disabled={isSubmitting}
            onPress={() => void handleLogin()}
            className={`min-h-[50px] items-center justify-center rounded-[10px] bg-[#2563eb] px-[18px] py-3 ${
              isSubmitting ? 'opacity-60' : ''
            }`}
            style={({ pressed }) =>
              pressed && !isSubmitting ? { opacity: 0.85 } : undefined
            }
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-base font-semibold text-white">Login</Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => router.push('/register')}
            className="mt-5 items-center p-2"
          >
            <Text className="text-[15px] font-semibold text-[#2563eb]">
              Belum punya akun? Daftar
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
