import "../global.css";
import { Tabs } from 'expo-router';
import { Text, View, type ColorValue } from 'react-native';

function TabIcon({
  icon,
  label,
  color,
  focused,
}: {
  icon: string;
  label: string;
  color: ColorValue;
  focused: boolean;
}) {
  return (
    <View
      style={{
        width: '100%',
        height: 76,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        backgroundColor: focused ? '#e5f4ed' : 'transparent',
      }}
    >
      <Text style={{ color, fontSize: 18, lineHeight: 23, fontWeight: focused ? '700' : '500' }}>
        {icon}
      </Text>
      <Text
        numberOfLines={1}
        style={{
          color,
          fontSize: 12,
          fontWeight: focused ? '700' : '600',
          marginTop: 2,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          width: 22,
          height: 4,
          borderRadius: 2,
          marginTop: 3,
          backgroundColor: focused ? '#07866f' : 'transparent',
        }}
      />
    </View>
  );
}

export default function RootLayout() {
  // Navbar bawah untuk berpindah antarhalaman utama aplikasi.
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#07866f',
        tabBarInactiveTintColor: '#93a39f',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          borderRadius: 24,
          marginHorizontal: 14,
          marginBottom: 10,
          paddingHorizontal: 8,
          paddingTop: 6,
          paddingBottom: 6,
          elevation: 8,
          shadowColor: '#172033',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        },
        tabBarItemStyle: {
          paddingHorizontal: 3,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="⌂" label="Home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="laporanudara"
        options={{
          title: 'Pantauan Udara',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="◉" label="Udara" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="konsultasi"
        options={{
          title: 'Konsultasi',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="+" label="Konsultasi" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="edukasi"
        options={{
          title: 'Edukasi',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="▤" label="Edukasi" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: 'Profil',
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="♟" label="Profil" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="register" options={{ href: null }} />
      <Tabs.Screen name="about" options={{ href: null }} />
    </Tabs>
  );
}
