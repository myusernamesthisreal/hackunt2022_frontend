/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import RNLocation from 'react-native-location';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {Button, PermissionsAndroid} from 'react-native';

import { LineChart } from 'react-native-chart-kit';

import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, 
  barPercentage: 0.5,
  useShadowColorFromDataset: false 
};

const Section = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const requestLocationPerms = async() => {
  try{
    const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    if(granted === PermissionsAndroid.RESULTS.GRANTED){
      console.log("You can use the location");
      return true;
    }
    else{
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: 'Location Permission',
        message: 'We need access to your location',
        buttonPositive: 'OK'
      }).then(
        granted => {
          if(granted === PermissionsAndroid.RESULTS.GRANTED){
            console.log("You gave access to location")
          }else{
            console.log("Location permission denied")
          }
          return false;
        }
      )
    }
  }catch(err){
    console.warn(err)
  }
}


RNLocation.configure({
  distanceFilter: 0.01,
  desiredAccuracy: {android: "highAccuracy", ios: "hundredMeters"},
  androidProvider: "playServices",
  interval: 1000,
})

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  let speedTime = 0;
  const [coords, setCoords] = React.useState({latitude: 0, longitude: 0});
  const [historicalData, setHistoricalData] = React.useState([]);
  const [startTime, setStartTime] = React.useState(0);
  const loaded = React.useRef(false);

const getLoc = async () => {
  const granted = await RNLocation.requestPermission({
    ios: "whenInUse",
    android: {
      detail: "fine",
      rationale: {
        title: "Location permission",
        message: "We need access to your location",
        buttonPositive: "OK",
        buttonNegative: "Cancel"
      }}});
      if (granted) {
  const loc = await RNLocation.getLatestLocation({ timeout: 500 })
  if (loc) {
    loc.speed *= 2.2369362920544;
    console.log("Location: ", loc);
    setCoords(loc);
    const d = [...historicalData];
    const data = {latitude: loc.latitude, longitude: loc.longitude, speed: loc.speed, timestamp: loc.timestamp}
    console.log(historicalData.length)
    if (historicalData.length >= 30) {
      d.splice(0,1);
      console.log(d.length);
    }
      d.push(data);
      setHistoricalData(d);
      setStartTime(d[0].timestamp);
      // clearTimeout(speedTime);
  }
}
}

React.useEffect(() => {
  if (requestLocationPerms() && loaded.current && !speedTime)
  speedTime = setTimeout(() => {
    getLoc();
  }, 1000);
  else
  loaded.current = true;
  return () => {
    clearInterval(speedTime);
  }
}, [historicalData])

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
          <Section title="Welcome to DriveSafe" />

        {historicalData?.length > 0 ? <View><LineChart data={
          { datasets: [{ data: historicalData.map(x => x.speed) }] }} height={150} width={screenWidth} chartConfig={chartConfig} /></View> : null}

        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
            
            <Section title="Testing GPS">
              <Button title="Request Perms" onPress={getLoc} />
            </Section>
          <Section title="Latitude:">
            <Text>{coords.latitude?.toFixed(3)} deg</Text>
          </Section>
          <Section title="Longitude: ">
            <Text>{coords.longitude?.toFixed(3)} deg</Text>
          </Section>
          <Section title="Speed: ">
            <Text>{coords.speed?.toFixed(3)} mph</Text>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginBottom: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  Text: {
    fontSize: 12,
    padding: 8,
    marginBottom: 16,
  }
});



export default App;
