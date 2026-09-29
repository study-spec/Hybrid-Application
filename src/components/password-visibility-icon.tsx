import { StyleSheet, View } from 'react-native';

type PasswordVisibilityIconProps = {
  visible: boolean;
};

export function PasswordVisibilityIcon({ visible }: PasswordVisibilityIconProps) {
  return (
    <View style={styles.icon}>
      <View style={styles.eye}>
        <View style={styles.pupil} />
      </View>
      {!visible ? <View style={styles.slash} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  eye: {
    alignItems: 'center',
    borderColor: '#667085',
    borderRadius: 12,
    borderWidth: 1.8,
    height: 14,
    justifyContent: 'center',
    width: 20,
  },
  pupil: {
    backgroundColor: '#667085',
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  slash: {
    backgroundColor: '#667085',
    height: 25,
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
    width: 1.8,
  },
});