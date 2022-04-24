/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';

import RNLocation from 'react-native-location';
// import Geolocation from 'react-native-geolocation-service';

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

import {
  accelerometer,
  gyroscope,
  setUpdateIntervalForType,
  SensorTypes
} from "react-native-sensors";

import { map, filter } from 'rxjs';

import {Button, PermissionsAndroid} from 'react-native';

const Section = ({children, title}): Node => {
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
  distanceFilter: null,
  desiredAccuracy: {android: "highAccuracy", ios: "hundredMeters"},
  androidProvider: "playServices",
  interval: 1000,
})


const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  setUpdateIntervalForType(SensorTypes.accelerometer, 300);

  let speedTime = 0;

  const [speed, setSpeed] = React.useState(0);
  const [coords, setCoords] = React.useState({latitude: 0, longitude: 0});

  // const subscription = accelerometer.pipe(map(({x, y, z}) => (x+y+z) - 9.81), filter(speed => speed)).subscribe(speed => setSpeed(speed), error => console.log(error));

  // setTimeout(() => {
  //   subscription.unsubscribe();
  // }, 1000);

  React.useEffect(() => {
    requestLocationPerms();
  }, [])

const getLoc = async () => {
  const loc = await RNLocation.getLatestLocation({ timeout: 1000 })
  if (loc) {
    console.log("Location: ", loc);
    setCoords(loc);
  }
}

const locationSubscription = RNLocation.subscribeToLocationUpdates(locations => {
  console.log("Location: ", locations);
  setCoords(locations[0]);
})

React.useEffect(() => {
  getLoc();
}, [])

// React.useEffect(() => {
//   if (requestLocationPerms())
//   speedTime = setInterval(getLoc, 1000);
//   return () => {
//     clearInterval(speedTime);
//   }
// }, [coords])

  // const getLoc = () => {
  //   if (RNLocation.getLatestLocation(
  //     (position) => {
  //       console.log(position);
  //       setCoords(position.coords);
  //       setSpeed(position.coords.speed);
  //     },
  //     (error) => {
  //       console.log(error);
  //     },
  //     { enableHighAccuracy: true, timeout: 10, maximumAge: 100, distanceFilter: 0 },
  //   )) {
  //     console.log("Location is enabled");
  //   }
  //   else requestLocationPerms();
  // }

  // React.useEffect(() => {
  //   if (typeof speed == "number") {
  //       speedTime = setTimeout(getLoc(), 1000);
  //     }
  //   else clearTimeout(speedTime);
  // }, [coords])

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
            <Section title="Testing Accelerometer">
              <Button title="Request Perms" onPress={getLoc} />
              
            </Section>
          <Text>{coords.latitude}</Text>
          <Text>{coords.longitude}</Text>
          <Text>{coords.speed}</Text>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
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
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});



export default App;
