import { Link, Stack } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function AboutScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-[#f8fafc] p-6">
      <Stack.Screen options={{ title: 'About' }} />
      <Text className="mb-2 text-[28px] font-bold">Halaman About</Text>
      <Text className="mb-5 text-base text-[#475569]">
        Ini contoh screen kedua untuk routing.
      </Text>

      <Link href="/" asChild>
        <Pressable className="rounded-[10px] bg-[#0f172a] px-[18px] py-3">
          <Text className="text-base font-semibold text-white">Kembali ke Home</Text>
        </Pressable>
      </Link>
    </View>
  );
}
