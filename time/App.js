import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import Menu from './comps/Menu';
import { Color } from './comps/Palette.js';
export default function App() {
  return (
    <SafeAreaView style={safeAreaAndroid.SafeArea}>
      
      <Menu user={'admin'}/>
    </SafeAreaView>
  );
}

const bodyStyle = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  }
});

const safeAreaAndroid = StyleSheet.create({
// Creates an area that is safe from notches or camera.
/* https://stackoverflow.com/questions/51289587/react-native-how-to-use-safeareaview-for-android-notch-devices*/
    SafeArea: {
      flex: 1,
      paddingTop: 30,//StatusBar?.currentHeight || 0,
    }
})
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
