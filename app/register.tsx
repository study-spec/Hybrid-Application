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
      className="flex-1 items-center justify-center bg-[#f7f9fc]"
    >
      <Stack.Screen options={{ title: 'Register' }} />
      <ScrollView
        alwaysBounceVertical
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          padding: 24,
          paddingBottom: 48,
          width: '100%',
        }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        showsVerticalScrollIndicator
      >

        <View className="self-center w-full max-w-[420px]">
          <Text className='text-[#172033] text-3xl font-bold mb-2'>Buat akun</Text>
          <Text className='text-[#667085] text-base mb-8'>Daftar untuk mulai menggunakan aplikasi.</Text>

          <Text className='text-[#344054] text-sm font-semibold mb-2'>Email</Text>
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
          className="bg-white border border-[#d0d5dd] rounded-[10px] text-[#172033] text-base mb-5 px-[14px] py-[13px]"
          textContentType="emailAddress"
          value={email}
        />

          <Text className='text-[#344054] text-sm font-semibold mb-2'>Username</Text>
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
          className="bg-white border border-[#d0d5dd] rounded-[10px] text-[#172033] text-base mb-5 px-[14px] py-[13px]"
          textContentType="username"
          value={username}
        />

          <Text className="text-[#344054] text-sm font-semibold mb-2">Password</Text>
          <View className="flex-row items-center bg-white border border-[#d0d5dd] rounded-[10px] mb-5">
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
              className="flex-1 text-[#172033] text-base px-[14px] py-[13px]"
              textContentType="newPassword"
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

          <Text className="text-[#344054] text-sm font-semibold mb-2">Konfirmasi password</Text>
          <View className="flex-row items-center bg-white border border-[#d0d5dd] rounded-[10px] mb-5">
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
              className="flex-1 text-[#172033] text-base px-[14px] py-[13px]"
              textContentType="newPassword"
              value={confirmPassword}
            />
            <Pressable
              accessibilityLabel={isConfirmPasswordVisible ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'}
              accessibilityRole="button"
              accessibilityState={{ selected: isConfirmPasswordVisible }}
              onPress={() => setIsConfirmPasswordVisible((visible) => !visible)}
              className="px-3 py-3"
            >
              <PasswordVisibilityIcon visible={isConfirmPasswordVisible} />
            </Pressable>
          </View>

          {error ? <Text className="text-[#b42318] text-sm">{error}</Text> : null}

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: isSubmitting }}
            disabled={isSubmitting}
            onPress={() => void handleRegister()}
            className={`min-h-[50px] items-center justify-center bg-blue-600 rounded-[10px] px-[18px] py-3 ${
            isSubmitting ? 'opacity-60' : 'active:opacity-85'
          }`}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white text-base font-semibold">Register</Text>
            )}
          </Pressable>

          <Pressable
          onPress={() => router.replace('/login')}
          className="items-center mt-5 p-2"
        >
          <Text className="text-blue-600 text-[15px] font-semibold">
            Sudah punya akun? Login
          </Text>
        </Pressable>

      </View>
    </ScrollView>
  </KeyboardAvoidingView>
  );
}
