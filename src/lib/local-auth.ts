import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCAL_USER_KEY = '@hybrid-app/local-user';

export function isGmailAddress(email: string) {
  return /^[^\s@]+@gmail\.com$/i.test(email);
}

export function hasUniquePasswordCharacters(password: string) {
  const characters = Array.from(password);
  return new Set(characters).size === characters.length;
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
