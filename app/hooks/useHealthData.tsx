import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Only import health modules if not running in Expo Go
let AppleHealthKit, HealthConnect;
const isExpoGo = Constants.appOwnership === 'expo';

if (!isExpoGo) {
  // Only import these if not in Expo Go
  AppleHealthKit = require('react-native-health').default;
  try {
    HealthConnect = require('react-native-health-connect');
  } catch (error) {
    console.log('Health Connect not available:', error);
  }
}

const useHealthData = (date: Date) => {
  const [hasPermissions, setHasPermission] = useState(false);
  const [steps, setSteps] = useState(0);
  const [flights, setFlights] = useState(0);
  const [distance, setDistance] = useState(0);

  // Mock data for Expo Go
  useEffect(() => {
    if (isExpoGo) {
      // Provide realistic mock data that changes slightly with the date
      const dateHash = date.getDate() + date.getMonth();
      setSteps(5000 + (dateHash * 500));
      setFlights(10 + (dateHash % 10));
      setDistance(3500 + (dateHash * 200));
      return;
    }
  }, [date]);

  // iOS - HealthKit
  useEffect(() => {
    if (isExpoGo || Platform.OS !== 'ios' || !AppleHealthKit) {
      return;
    }

    const permissions = {
      permissions: {
        read: [
          AppleHealthKit.Constants.Permissions.Steps,
          AppleHealthKit.Constants.Permissions.FlightsClimbed,
          AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
        ],
        write: [],
      },
    };

    AppleHealthKit.isAvailable((err, isAvailable) => {
      if (err) {
        console.log('Error checking availability');
        return;
      }
      if (!isAvailable) {
        console.log('Apple Health not available');
        return;
      }
      AppleHealthKit.initHealthKit(permissions, (err) => {
        if (err) {
          console.log('Error getting permissions');
          return;
        }
        setHasPermission(true);
      });
    });
  }, []);

  useEffect(() => {
    if (isExpoGo || Platform.OS !== 'ios' || !hasPermissions || !AppleHealthKit) {
      return;
    }

    const options = {
      date: date.toISOString(),
      includeManuallyAdded: false,
    };

    AppleHealthKit.getStepCount(options, (err, results) => {
      if (err) {
        console.log('Error getting the steps');
        return;
      }
      setSteps(results.value);
    });

    AppleHealthKit.getFlightsClimbed(options, (err, results) => {
      if (err) {
        console.log('Error getting the flights:', err);
        return;
      }
      setFlights(results.value);
    });

    AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
      if (err) {
        console.log('Error getting the distance:', err);
        return;
      }
      setDistance(results.value);
    });
  }, [hasPermissions, date]);

  // Android - Health Connect
  useEffect(() => {
    if (isExpoGo || Platform.OS !== 'android' || !HealthConnect) {
      return;
    }

    const readSampleData = async () => {
      try {
        // initialize the client
        const isInitialized = await HealthConnect.initialize();
        if (!isInitialized) {
          return;
        }

        // request permissions
        await HealthConnect.requestPermission([
          { accessType: 'read', recordType: 'Steps' },
          { accessType: 'read', recordType: 'Distance' },
          { accessType: 'read', recordType: 'FloorsClimbed' },
        ]);

        const timeRangeFilter = {
          operator: 'between',
          startTime: new Date(new Date(date).setHours(0, 0, 0, 0)).toISOString(),
          endTime: new Date(new Date(date).setHours(23, 59, 59, 999)).toISOString(),
        };

        // Steps
        const steps = await HealthConnect.readRecords('Steps', { timeRangeFilter });
        const totalSteps = steps.reduce((sum, cur) => sum + cur.count, 0);
        setSteps(totalSteps);

        // Distance
        const distance = await HealthConnect.readRecords('Distance', { timeRangeFilter });
        const totalDistance = distance.reduce(
          (sum, cur) => sum + cur.distance.inMeters,
          0
        );
        setDistance(totalDistance);

        // Floors climbed
        const floorsClimbed = await HealthConnect.readRecords('FloorsClimbed', {
          timeRangeFilter,
        });
        const totalFloors = floorsClimbed.reduce((sum, cur) => sum + cur.floors, 0);
        setFlights(totalFloors);
      } catch (error) {
        console.log('Error reading health data:', error);
      }
    };

    readSampleData();
  }, [date]);

  return {
    steps,
    flights,
    distance,
  };
};

export default useHealthData;