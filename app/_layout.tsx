import "../global.css";
import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function RootLayout() {
  // Navbar bawah untuk berpindah antarhalaman utama aplikasi.
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#55735d',
        tabBarInactiveTintColor: '#849087',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e9ede7',
          height: 64,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>⌂</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="laporanudara"
        options={{
          title: 'Pantauan Udara',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>◉</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="konsultasi"
        options={{
          title: 'Konsultasi',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>♡</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="edukasi"
        options={{
          title: 'Edukasi',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>▤</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: 'Profil',
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>●</Text>
          ),
        }}
      />
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="register" options={{ href: null }} />
      <Tabs.Screen name="about" options={{ href: null }} />
    </Tabs>
  );
}