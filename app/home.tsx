import { Link, Stack } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

type AirLevel = 'good' | 'moderate' | 'unhealthy';

const AIR_QUALITY_INDEX = 78;
const LOCATION = 'Jakarta Selatan';

function getAirLevel(index: number): AirLevel {
  if (index <= 50) return 'good';
  if (index <= 100) return 'moderate';
  return 'unhealthy';
}

const airLevelStyles = {
  good: {
    label: 'Baik',
    description: 'Udara aman untuk beraktivitas di luar.',
    color: '#18794e',
    background: '#e5f6ec',
    border: '#b7e4c7',
    icon: '🌿',
  },
  moderate: {
    label: 'Sedang',
    description: 'Kelompok sensitif sebaiknya membatasi aktivitas lama di luar.',
    color: '#9a6700',
    background: '#fff5d6',
    border: '#f2d675',
    icon: '☀️',
  },
  unhealthy: {
    label: 'Tidak sehat',
    description: 'Kurangi aktivitas luar dan gunakan masker saat harus bepergian.',
    color: '#b42318',
    background: '#feeceb',
    border: '#f4b4af',
    icon: '⚠️',
  },
} satisfies Record<AirLevel, {
  label: string;
  description: string;
  color: string;
  background: string;
  border: string;
  icon: string;
}>;

const symptoms = [
  'Batuk atau tenggorokan terasa gatal',
  'Sesak napas atau napas terasa berat',
  'Mata perih atau berair',
];

export default function AirQualityHomeScreen() {
  const [isSymptomCheckOpen, setIsSymptomCheckOpen] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const airLevel = getAirLevel(AIR_QUALITY_INDEX);
  const air = airLevelStyles[airLevel];

  function toggleSymptom(symptom: string) {
    setSelectedSymptoms((selected) =>
      selected.includes(symptom)
        ? selected.filter((item) => item !== symptom)
        : [...selected, symptom],
    );
  }

  return (
    <View className="flex-1 bg-[#f7f8f3]">
      <Stack.Screen options={{ title: 'Beranda' }} />
      <ScrollView
        contentContainerClassName="w-full max-w-[560px] self-center px-[22px] pb-9 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="mb-1.5 text-[11px] font-bold tracking-[1.4px] text-[#5d8065]">
              PANTAU UDARA
            </Text>
            <Text className="text-2xl font-bold text-[#1e3024]">
              Halo, tetap sehat 👋
            </Text>
          </View>
          <Link href="/login" asChild>
            <Pressable
              accessibilityRole="button"
              className="h-11 w-11 items-center justify-center rounded-full bg-[#e4eee2]"
            >
              <Text className="text-[17px] font-bold text-[#3e684b]">U</Text>
            </Pressable>
          </Link>
        </View>

        <View className="mt-4 mb-5 flex-row items-center">
          <Text className="mr-1.5 text-lg text-[#5d8065]">⌖</Text>
          <Text className="mr-2 text-sm font-semibold text-[#344438]">{LOCATION}</Text>
          <Text className="text-xs text-[#849087]">• Data contoh</Text>
        </View>

        <View
          accessibilityLabel={`Kualitas udara ${air.label}, indeks ${AIR_QUALITY_INDEX}`}
          className="rounded-3xl border p-[21px]"
          style={{ backgroundColor: air.background, borderColor: air.border }}
        >
          <View className="flex-row items-center justify-between">
            <Text
              className="text-[11px] font-bold tracking-[0.9px]"
              style={{ color: air.color }}
            >
              RINGKASAN KUALITAS UDARA
            </Text>
            <Text className="text-[25px]">{air.icon}</Text>
          </View>
          <View className="mt-3 flex-row items-center">
            <Text
              className="mr-3 text-[58px] font-bold leading-[65px] tracking-[-2px]"
              style={{ color: air.color }}
            >
              {AIR_QUALITY_INDEX}
            </Text>
            <View>
              <Text
                className="mb-[5px] text-[13px] font-bold"
                style={{ color: air.color }}
              >
                AQI
              </Text>
              <View
                className="self-start rounded-full px-[11px] py-[5px]"
                style={{ backgroundColor: air.color }}
              >
                <Text className="text-xs font-bold text-white">{air.label}</Text>
              </View>
            </View>
          </View>
          <Text className="mt-1.5 text-[13px] leading-[19px] text-[#47554a]">
            {air.description}
          </Text>
          <View className="relative mt-[21px] h-[7px] flex-row">
            <View className="flex-1 rounded-l-[5px] bg-[#42a66c]" />
            <View className="flex-1 bg-[#e8b83f]" />
            <View className="flex-1 rounded-r-[5px] bg-[#d9534f]" />
            <View
              className="absolute top-[-4px] -ml-[7px] h-[14px] w-[14px] rounded-[7px] border-2 border-[#344438] bg-white"
              style={{ left: `${Math.min(AIR_QUALITY_INDEX, 150) / 150 * 100}%` }}
            />
          </View>
          <View className="mt-2 flex-row justify-between">
            <Text className="text-[10px] text-[#69746b]">Baik</Text>
            <Text className="text-[10px] text-[#69746b]">Sedang</Text>
            <Text className="text-[10px] text-[#69746b]">Berbahaya</Text>
          </View>
        </View>

        <View className="mt-7 mb-3.5">
          <Text className="text-lg font-bold text-[#1e3024]">Kenali kondisi tubuhmu</Text>
          <Text className="mt-[5px] text-[13px] text-[#758078]">
            Polusi udara bisa memengaruhi kesehatan.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: isSymptomCheckOpen }}
          onPress={() => setIsSymptomCheckOpen((open) => !open)}
          className="flex-row items-center rounded-[18px] border border-[#e9ede7] bg-white px-[15px] py-4"
          style={({ pressed }) => pressed ? { opacity: 0.82 } : undefined}
        >
          <View className="mr-[13px] h-[46px] w-[46px] items-center justify-center rounded-[14px] bg-[#eef3ff]">
            <Text className="text-[22px]">🩺</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[15px] font-bold text-[#26372b]">Cek gejala</Text>
            <Text className="mt-1 text-xs leading-[17px] text-[#778178]">
              Periksa tanda yang mungkin kamu rasakan.
            </Text>
          </View>
          <Text className="ml-2 text-[25px] text-[#708074]">
            {isSymptomCheckOpen ? '⌃' : '›'}
          </Text>
        </Pressable>

        {isSymptomCheckOpen ? (
          <View className="mt-[-8px] rounded-b-[18px] border border-t-0 border-[#e9ede7] bg-white p-4 pt-[23px]">
            <Text className="mb-2.5 text-[13px] font-semibold text-[#344438]">
              Apakah kamu merasakan salah satu dari ini?
            </Text>
            {symptoms.map((symptom) => (
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selectedSymptoms.includes(symptom) }}
                key={symptom}
                onPress={() => toggleSymptom(symptom)}
                className="mb-[7px] min-h-[34px] flex-row items-center"
              >
                <View
                  className={`mr-2 h-[19px] w-[19px] items-center justify-center rounded-[5px] border ${
                    selectedSymptoms.includes(symptom)
                      ? 'border-[#55735d] bg-[#55735d]'
                      : 'border-[#b8c2ba]'
                  }`}
                >
                  {selectedSymptoms.includes(symptom) ? (
                    <Text className="text-[13px] font-bold leading-4 text-white">✓</Text>
                  ) : null}
                </View>
                <Text className="flex-1 text-xs leading-[18px] text-[#5d685f]">
                  {symptom}
                </Text>
              </Pressable>
            ))}
            {selectedSymptoms.length > 0 ? (
              <Text className="mt-1 rounded-[10px] bg-[#fff5d6] p-2.5 text-[11px] leading-4 text-[#745800]">
                Kamu menandai gejala yang dirasakan. Ini bukan diagnosis medis.
                Jika keluhan berat atau memburuk, segera hubungi tenaga
                kesehatan.
              </Text>
            ) : null}
            <Text className="mt-2 rounded-[10px] bg-[#f6f7f3] p-2.5 text-[11px] leading-4 text-[#667268]">
              Jika gejala terasa berat atau tidak membaik, hubungi tenaga
              kesehatan. Cek ini bukan diagnosis medis.
            </Text>
          </View>
        ) : null}

        <View className="mt-[27px] mb-[13px] flex-row items-center justify-between">
          <Text className="text-lg font-bold text-[#1e3024]">Tips hari ini</Text>
          <Text className="text-[10px] font-bold tracking-[1px] text-[#718078]">
            HARI INI
          </Text>
        </View>

        <View className="mb-2.5 flex-row items-center rounded-[18px] border border-[#e9ede7] bg-white p-3.5">
          <View className="mr-3 h-11 w-11 items-center justify-center rounded-[13px] bg-[#eaf2ff]">
            <Text className="text-[21px]">😷</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[13px] font-bold text-[#344438]">
              Pakai masker dengan baik
            </Text>
            <Text className="mt-1 text-[11px] leading-4 text-[#778178]">
              Pilih masker yang rapat menutup hidung dan mulut saat di luar.
            </Text>
          </View>
        </View>
        <View className="mb-2.5 flex-row items-center rounded-[18px] border border-[#e9ede7] bg-white p-3.5">
          <View className="mr-3 h-11 w-11 items-center justify-center rounded-[13px] bg-[#e9f4e9]">
            <Text className="text-[21px]">🪟</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[13px] font-bold text-[#344438]">
              Perhatikan kualitas udara
            </Text>
            <Text className="mt-1 text-[11px] leading-4 text-[#778178]">
              Kurangi ventilasi dari luar saat kualitas udara sedang buruk.
            </Text>
          </View>
        </View>

        <Link href="/register" asChild>
          <Pressable className="mt-[18px] flex-row items-center self-center p-2.5">
            <Text className="text-xs font-semibold text-[#55735d]">
              Buat akun untuk mulai
            </Text>
            <Text className="ml-1.5 text-base text-[#55735d]">→</Text>
          </Pressable>
        </Link>
      </ScrollView>
    </View>
  );
}
