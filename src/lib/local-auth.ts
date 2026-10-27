import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCAL_USER_KEY = '@hybrid-app/local-user';

export function isGmailAddress(email: string) {
  return /^[^\s@]+@gmail\.com$/i.test(email);
}

export function hasPasswordRequirements(password: string) {
  if (password.length < 8) {
    return false;
  }

  if (!/\d/.test(password)) {
    return false;
  }

  return /[^A-Za-z0-9]/.test(password);
}

export type LocalUser = {
  email: string;
  username: string;
  password: string;
};

export async function saveLocalUser(user: LocalUser) {
  await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
}

export async function getLocalUser() {
  const storedUser = await AsyncStorage.getItem(LOCAL_USER_KEY);
  return storedUser ? (JSON.parse(storedUser) as LocalUser) : null;
}
