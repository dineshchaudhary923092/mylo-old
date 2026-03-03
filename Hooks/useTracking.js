import {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
// import Geolocation from '@react-native-community/geolocation';
import {getDistanceFromLatLonInKm} from './getDistance';

const useTracking = (props) => {
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [history, setHistory] = useState([]);
  const [distance, setDistance] = useState(0);
  const [isActive, setIsActive] = useState(props);

  useEffect(() => {
    BackgroundGeolocation.start();
    BackgroundGeolocation.getCurrentLocation(
        location => {
            setLocation((prev) => ({
                ...prev,
                latitude: location.latitude,
                longitude: location.longitude,
            }));
        },
        error => console.log('Error: ', JSON.stringify(error)),
        {enableHighAccuracy: true, timeout: 5000, maximumAge: 1000},
    );
  }, [])

  useEffect(() => {
    if (!isActive) {
      return;
    }
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 10,
      distanceFilter: 10,
      notificationTitle: 'MyLo Buddy Alert',
      notificationText: 'Enabled',
      // debug: true,
      startOnBoot: true,
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER, // DISTANCE_FILTER_PROVIDER for
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnStillActivity: false,
      // startForeground: true,
      startOnBoot: true,
    });

    BackgroundGeolocation.on('location', (location) => {
      // console.log('loc', location);
      setLocation((prev) => ({
        ...prev,
        latitude: location.latitude,
        longitude: location.longitude,
      }));

      setHistory((prev) => {
        setDistance((prevDistance) => {
          if (prev.length === 0) {
            return 0;
          }
          const latestItem = prev[prev.length - 1];
          return (
            prevDistance +
            getDistanceFromLatLonInKm(
              latestItem.latitude,
              latestItem.longitude,
              location.latitude,
              location.longitude,
            )
          );
        });

        return prev.concat({
          latitude: location.latitude,
          longitude: location.longitude,
        });
      });
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      BackgroundGeolocation.startTask((taskKey) => {
        // execute long running task
        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on('stationary', (stationaryLocation) => {
      // handle stationary locations here
      // console.log('stationary :' + JSON.stringify(stationaryLocation))
      setLocation((prev) => ({
        ...prev,
        latitude: JSON.stringify(stationaryLocation.latitude),
        longitude: JSON.stringify(stationaryLocation.longitude),
      }));

      setHistory((prev) => {
        setDistance((prevDistance) => {
          if (prev.length === 0) {
            return 0;
          }
          const latestItem = prev[prev.length - 1];
          return (
            prevDistance +
            getDistanceFromLatLonInKm(
              latestItem.latitude,
              latestItem.longitude,
              JSON.stringify(stationaryLocation.latitude),
                JSON.stringify(stationaryLocation.longitude),
            )
          );
        });

        return prev.concat({
          latitude: JSON.stringify(stationaryLocation.latitude),
          longitude: JSON.stringify(stationaryLocation.longitude),
        });
      });
    });

    BackgroundGeolocation.on('error', (error) => {
      //console.log('[ERROR] BackgroundGeolocation error:', error);
    });

    BackgroundGeolocation.on('start', () => {
      //console.log('[INFO] BackgroundGeolocation service has been started');
    });

    BackgroundGeolocation.on('stop', () => {
      // console.log('[INFO] BackgroundGeolocation service has been stopped');
    });

    BackgroundGeolocation.on('authorization', (status) => {
      console.log(
        '[INFO] BackgroundGeolocation authorization status: ' + status,
      );
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(
          () =>
            Alert.alert(
              'Mylo requires location tracking permission',
              'Would you like to open app settings?',
              [
                {
                  text: 'Yes',
                  onPress: () => BackgroundGeolocation.showAppSettings(),
                },
                {
                  text: 'No',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel',
                },
              ],
            ),
          1000,
        );
      }
    });

    BackgroundGeolocation.on('background', () => {
      console.log('[INFO] App is in background');
    });

    BackgroundGeolocation.on('foreground', () => {
      console.log('[INFO] App is in foreground');
    });

    BackgroundGeolocation.checkStatus((status) => {
      // console.log(
      //   '[INFO] BackgroundGeolocation service is running',
      //   status.isRunning,
      // );
      // console.log(
      //   '[INFO] BackgroundGeolocation services enabled',
      //   status.locationServicesEnabled,
      // );
      // console.log(
      //   '[INFO] BackgroundGeolocation auth status: ' + status.authorization,
      // );

      // you don't need to check status before start (this is just the example)
      // console.log(status);
      if (!status.isRunning) {
        BackgroundGeolocation.start(); //triggers start on start event
      }
    });

    return () => {
      // console.log('Removing all listeners');
      BackgroundGeolocation.removeAllListeners();
    };
  }, [location, isActive]);

  return {location, history, distance};
};

export default useTracking;