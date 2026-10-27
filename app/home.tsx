import { Link, Stack } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
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
    <View style={styles.screen}>
      <Stack.Screen options={{ title: 'Beranda' }} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View>
            <Text style={styles.eyebrow}>PANTAU UDARA</Text>
            <Text style={styles.greeting}>Halo, tetap sehat 👋</Text>
          </View>
          <Link href="/login" asChild>
            <Pressable accessibilityRole="button" style={styles.profileButton}>
              <Text style={styles.profileInitial}>U</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.locationRow}>
          <Text style={styles.locationPin}>⌖</Text>
          <Text style={styles.location}>{LOCATION}</Text>
          <Text style={styles.updated}>• Data contoh</Text>
        </View>

        <View
          accessibilityLabel={`Kualitas udara ${air.label}, indeks ${AIR_QUALITY_INDEX}`}
          style={[
            styles.airCard,
            { backgroundColor: air.background, borderColor: air.border },
          ]}
        >
          <View style={styles.airCardHeader}>
            <Text style={[styles.cardEyebrow, { color: air.color }]}>
              RINGKASAN KUALITAS UDARA
            </Text>
            <Text style={styles.airIcon}>{air.icon}</Text>
          </View>
          <View style={styles.aqiRow}>
            <Text style={[styles.aqiValue, { color: air.color }]}>
              {AIR_QUALITY_INDEX}
            </Text>
            <View>
              <Text style={[styles.aqiUnit, { color: air.color }]}>AQI</Text>
              <View style={[styles.statusPill, { backgroundColor: air.color }]}>
                <Text style={styles.statusText}>{air.label}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.airDescription}>{air.description}</Text>
          <View style={styles.scaleTrack}>
            <View style={[styles.scaleSegment, styles.scaleGood]} />
            <View style={[styles.scaleSegment, styles.scaleModerate]} />
            <View style={[styles.scaleSegment, styles.scaleUnhealthy]} />
            <View
              style={[
                styles.scaleMarker,
                { left: `${Math.min(AIR_QUALITY_INDEX, 150) / 150 * 100}%` },
              ]}
            />
          </View>
          <View style={styles.scaleLabels}>
            <Text style={styles.scaleLabel}>Baik</Text>
            <Text style={styles.scaleLabel}>Sedang</Text>
            <Text style={styles.scaleLabel}>Berbahaya</Text>
          </View>
        </View>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Kenali kondisi tubuhmu</Text>
          <Text style={styles.sectionSubtitle}>
            Polusi udara bisa memengaruhi kesehatan.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: isSymptomCheckOpen }}
          onPress={() => setIsSymptomCheckOpen((open) => !open)}
          style={({ pressed }) => [
            styles.symptomCard,
            pressed ? styles.pressed : null,
          ]}
        >
          <View style={styles.symptomIcon}>
            <Text style={styles.symptomEmoji}>🩺</Text>
          </View>
          <View style={styles.symptomCopy}>
            <Text style={styles.cardTitle}>Cek gejala</Text>
            <Text style={styles.cardDescription}>
              Periksa tanda yang mungkin kamu rasakan.
            </Text>
          </View>
          <Text style={styles.chevron}>{isSymptomCheckOpen ? '⌃' : '›'}</Text>
        </Pressable>

        {isSymptomCheckOpen ? (
          <View style={styles.symptomDetails}>
            <Text style={styles.symptomPrompt}>
              Apakah kamu merasakan salah satu dari ini?
            </Text>
            {symptoms.map((symptom) => (
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selectedSymptoms.includes(symptom) }}
                key={symptom}
                onPress={() => toggleSymptom(symptom)}
                style={styles.symptomItem}
              >
                <View
                  style={[
                    styles.symptomCheckbox,
                    selectedSymptoms.includes(symptom)
                      ? styles.symptomCheckboxSelected
                      : null,
                  ]}
                >
                  {selectedSymptoms.includes(symptom) ? (
                    <Text style={styles.symptomCheckmark}>✓</Text>
                  ) : null}
                </View>
                <Text style={styles.symptomText}>{symptom}</Text>
              </Pressable>
            ))}
            {selectedSymptoms.length > 0 ? (
              <Text style={styles.selectedSymptomMessage}>
                Kamu menandai gejala yang dirasakan. Ini bukan diagnosis medis.
                Jika keluhan berat atau memburuk, segera hubungi tenaga
                kesehatan.
              </Text>
            ) : null}
            <Text style={styles.disclaimer}>
              Jika gejala terasa berat atau tidak membaik, hubungi tenaga
              kesehatan. Cek ini bukan diagnosis medis.
            </Text>
          </View>
        ) : null}

        <View style={styles.tipsHeading}>
          <Text style={styles.sectionTitle}>Tips hari ini</Text>
          <Text style={styles.tipDate}>HARI INI</Text>
        </View>

        <View style={styles.tipCard}>
          <View style={[styles.tipIcon, styles.tipIconBlue]}>
            <Text style={styles.tipEmoji}>😷</Text>
          </View>
          <View style={styles.tipCopy}>
            <Text style={styles.tipTitle}>Pakai masker dengan baik</Text>
            <Text style={styles.tipDescription}>
              Pilih masker yang rapat menutup hidung dan mulut saat di luar.
            </Text>
          </View>
        </View>
        <View style={styles.tipCard}>
          <View style={[styles.tipIcon, styles.tipIconGreen]}>
            <Text style={styles.tipEmoji}>🪟</Text>
          </View>
          <View style={styles.tipCopy}>
            <Text style={styles.tipTitle}>Perhatikan kualitas udara</Text>
            <Text style={styles.tipDescription}>
              Kurangi ventilasi dari luar saat kualitas udara sedang buruk.
            </Text>
          </View>
        </View>

        <Link href="/register" asChild>
          <Pressable style={styles.registerLink}>
            <Text style={styles.registerLinkText}>Buat akun untuk mulai</Text>
            <Text style={styles.registerArrow}>→</Text>
          </Pressable>
        </Link>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f7f8f3',
  },
  content: {
    alignSelf: 'center',
    maxWidth: 560,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 36,
    width: '100%',
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: '#5d8065',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  greeting: {
    color: '#1e3024',
    fontSize: 24,
    fontWeight: '700',
  },
  profileButton: {
    alignItems: 'center',
    backgroundColor: '#e4eee2',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  profileInitial: {
    color: '#3e684b',
    fontSize: 17,
    fontWeight: '700',
  },
  locationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 20,
  },
  locationPin: {
    color: '#5d8065',
    fontSize: 18,
    marginRight: 6,
  },
  location: {
    color: '#344438',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  updated: {
    color: '#849087',
    fontSize: 12,
  },
  airCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 21,
  },
  airCardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.9,
  },
  airIcon: {
    fontSize: 25,
  },
  aqiRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 12,
  },
  aqiValue: {
    fontSize: 58,
    fontWeight: '700',
    letterSpacing: -2,
    lineHeight: 65,
    marginRight: 12,
  },
  aqiUnit: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 5,
  },
  statusPill: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  airDescription: {
    color: '#47554a',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  scaleTrack: {
    flexDirection: 'row',
    height: 7,
    marginTop: 21,
    position: 'relative',
  },
  scaleSegment: {
    flex: 1,
  },
  scaleGood: {
    backgroundColor: '#42a66c',
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
  },
  scaleModerate: {
    backgroundColor: '#e8b83f',
  },
  scaleUnhealthy: {
    backgroundColor: '#d9534f',
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
  },
  scaleMarker: {
    backgroundColor: '#ffffff',
    borderColor: '#344438',
    borderRadius: 7,
    borderWidth: 2,
    height: 14,
    marginLeft: -7,
    position: 'absolute',
    top: -4,
    width: 14,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  scaleLabel: {
    color: '#69746b',
    fontSize: 10,
  },
  sectionHeading: {
    marginTop: 28,
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#1e3024',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: '#758078',
    fontSize: 13,
    marginTop: 5,
  },
  symptomCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e9ede7',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 16,
  },
  pressed: {
    opacity: 0.82,
  },
  symptomIcon: {
    alignItems: 'center',
    backgroundColor: '#eef3ff',
    borderRadius: 14,
    height: 46,
    justifyContent: 'center',
    marginRight: 13,
    width: 46,
  },
  symptomEmoji: {
    fontSize: 22,
  },
  symptomCopy: {
    flex: 1,
  },
  cardTitle: {
    color: '#26372b',
    fontSize: 15,
    fontWeight: '700',
  },
  cardDescription: {
    color: '#778178',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  chevron: {
    color: '#708074',
    fontSize: 25,
    marginLeft: 8,
  },
  symptomDetails: {
    backgroundColor: '#ffffff',
    borderColor: '#e9ede7',
    borderTopWidth: 0,
    borderWidth: 1,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    marginTop: -8,
    padding: 16,
    paddingTop: 23,
  },
  symptomPrompt: {
    color: '#344438',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  symptomItem: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 7,
    minHeight: 34,
  },
  symptomCheckbox: {
    alignItems: 'center',
    borderColor: '#b8c2ba',
    borderRadius: 5,
    borderWidth: 1,
    height: 19,
    justifyContent: 'center',
    marginRight: 8,
    width: 19,
  },
  symptomCheckboxSelected: {
    backgroundColor: '#55735d',
    borderColor: '#55735d',
  },
  symptomCheckmark: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
  },
  symptomText: {
    color: '#5d685f',
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  selectedSymptomMessage: {
    backgroundColor: '#fff5d6',
    borderRadius: 10,
    color: '#745800',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
    padding: 10,
  },
  disclaimer: {
    backgroundColor: '#f6f7f3',
    borderRadius: 10,
    color: '#667268',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 8,
    padding: 10,
  },
  tipsHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 27,
    marginBottom: 13,
  },
  tipDate: {
    color: '#718078',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  tipCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e9ede7',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 10,
    padding: 14,
  },
  tipIcon: {
    alignItems: 'center',
    borderRadius: 13,
    height: 44,
    justifyContent: 'center',
    marginRight: 12,
    width: 44,
  },
  tipIconBlue: {
    backgroundColor: '#eaf2ff',
  },
  tipIconGreen: {
    backgroundColor: '#e9f4e9',
  },
  tipEmoji: {
    fontSize: 21,
  },
  tipCopy: {
    flex: 1,
  },
  tipTitle: {
    color: '#344438',
    fontSize: 13,
    fontWeight: '700',
  },
  tipDescription: {
    color: '#778178',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },
  registerLink: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: 18,
    padding: 10,
  },
  registerLinkText: {
    color: '#55735d',
    fontSize: 12,
    fontWeight: '600',
  },
  registerArrow: {
    color: '#55735d',
    fontSize: 16,
    marginLeft: 6,
  },
});
