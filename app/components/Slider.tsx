import { View, Text,Image, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import GlobalApi from '../Shared/GlobalApi';
import { FlatList } from 'react-native-gesture-handler';

// Interface defining the expected structure of each slider item from the API response
interface SliderItem {
  id: number;
  Name: string,
  image: {
    url: string;
  };
}

// Interface defining the simplified structure for slider data used within the component
interface SliderData {
  id: number;
  name: string;
  imageUrl: string;
}
const BASE_URL = 'http://localhost:1337';
export default function Slider() {
  // State to hold formatted slider data
  const [slider, setSlider] = useState<SliderData[]>([]);

  // Fetch slider data from the API when the component mounts
  useEffect(() => {
    getSlider();
  }, []);

  // Asynchronous function to fetch and process slider data
  const getSlider = async () => {
    // Make API call to retrieve slider data
    const response = await GlobalApi.getSlider();
    const result: SliderItem = response.data;

    // Transform the API response data into a simpler format suitable for the component
    const formattedData: SliderData[] = result.data.map((item) => ({
      id: item.id,
      name: item.Name,
      image: `${BASE_URL}${item.image.formats.medium.url}`,
    }));

    // Log formatted data to the console for debugging purposes
    console.log(formattedData);

    // Update component state with formatted slider data
    setSlider(formattedData);
  };

  // Render basic view with placeholder text
  return (
    <View style={{marginTop: 10}}>
      <FlatList
          data={slider}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({item})=>(
              <View>
                  <Image 
                    source = {{uri: item.image}} 
                    style={{width: Dimensions.get('screen').width*0.85,  
                    height: 160,
                    borderRadius: 10,
                    marginRight: 15}}
                  />
              </View>
          )}
      />
    </View>
  );
}
