import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import Value from '../../components/Value';
import RingProgress from '../../components/RingProgress';
import { useState } from 'react';
import useHealthData from '../../hooks/useHealthData';
import { AntDesign } from '@expo/vector-icons';
import {Header} from '@/app/components/Headers';
const STEPS_GOAL = 10_000;

export default function App() {
  const [date, setDate] = useState(new Date());
  const { steps, flights, distance } = useHealthData(date);

  const changeDate = (numDays) => {
    const currentDate = new Date(date); // Create a copy of the current date
    // Update the date by adding/subtracting the number of days
    currentDate.setDate(currentDate.getDate() + numDays);
    setDate(currentDate); // Update the state variable
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.datePicker}>
          <AntDesign
            onPress={() => changeDate(-1)}
            name="left"
            size={20}
            color="#C3FF53"
          />
          <Text style={styles.date}>{date.toDateString()}</Text>

          <AntDesign
            onPress={() => changeDate(1)}
            name="right"
            size={20}
            color="#C3FF53"
          />
        </View>

        <RingProgress
          radius={150}
          strokeWidth={50}
          progress={steps / STEPS_GOAL}
        />

        <View style={styles.values}>
          <Value label="Steps" value={steps.toString()} />
          <Value label="Distance" value={`${(distance / 1000).toFixed(2)} km`} />
          <Value label="Flights Climbed" value={flights.toString()} />
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 30,
  },
  values: {
    flexDirection: 'row',
    gap: 25,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  datePicker: {
    alignItems: 'center',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  date: {
    color: 'white',
    fontWeight: '500',
    fontSize: 20,
    marginHorizontal: 20,
  },
});