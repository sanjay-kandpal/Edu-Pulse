 import { View, StyleSheet,Text } from 'react-native';


type ValueProps = {
  label: String;
  value: String;
}

const Value = ({label,value}: ValueProps) => (
  <View>  
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
)

const styles = StyleSheet.create({
    label:{
      color: 'white',
      fontSize: 20,
    },
    value: {
      fontSize: 35,
      color: '#AFB3BE',
      fontWeight: '500',
    },
    values: {
      flexDirection: 'row',
      gap: 25,
      flexWrap: 'wrap'
    }
  });

export default Value