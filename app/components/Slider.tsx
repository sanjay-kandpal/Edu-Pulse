import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import GlobalApi from '../Shared/GlobalApi';
import { FlatList } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

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

const BASE_URL = `http://${process.env.EXPO_PUBLIC_IP}:3000`;
const { width, height } = Dimensions.get('screen');

export default function Slider() {
  // State to hold formatted slider data
  const [slider, setSlider] = useState<SliderData[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Fetch slider data from the API when the component mounts
  useEffect(() => {
    getSlider();
  }, []);

  // Asynchronous function to fetch and process slider data
  const getSlider = async () => {
    try {
      // Make API call to retrieve slider data
      const response = await GlobalApi.getSlider();
      const result = response.data;

      // Transform the API response data into a simpler format suitable for the component
      const formattedData: SliderData[] = result.data.map((item) => ({
        id: item.id,
        name: item.attributes.Name,
        imageUrl: `${BASE_URL}${item.attributes.image.data.attributes.formats.medium.url}`,
      }));

      // Update component state with formatted slider data
      setSlider(formattedData);
    } catch (error) {
      console.error('Error fetching slider data:', error);
    }
  };

  // Update active index when scrolling
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (width * 0.85));
    setActiveIndex(index);
  };

  // Pagination dots to show current slide position
  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {slider.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              { backgroundColor: index === activeIndex ? '#86A8E7' : '#D2DFFF' }
            ]}
          />
        ))}
      </View>
    );
  };

  // Render slider with Ghibli-inspired styling
  return (
    <View style={styles.container}>
      <FlatList
        data={slider}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        snapToInterval={width * 0.85 + 15}
        decelerationRate="fast"
        onScroll={handleScroll}
        renderItem={({item, index}) => (
          <View style={styles.slideContainer}>
            {/* Animated clouds overlay effect */}
            <View style={[styles.cloudOverlay, { opacity: 0.6 }]} />
            
            <Image 
              source={{ uri: item.imageUrl }} 
              style={styles.slideImage}
            />
            
            {/* Soft gradient overlay */}
            <LinearGradient
              colors={['transparent', 'rgba(71, 115, 168, 0.5)']}
              style={styles.gradientOverlay}
            />
            
            {/* Image title with decorative elements */}
            <View style={styles.titleContainer}>
              <View style={styles.titleDecoration} />
              <Text style={styles.titleText}>{item.name}</Text>
              <View style={styles.titleDecoration} />
            </View>
          </View>
        )}
      />
      
      {renderPagination()}
    </View>
  );
}

// Ghibli-inspired styling
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingBottom: 25,
  },
  slideContainer: {
    width: width * 0.85,
    height: 180,
    marginRight: 15,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    // Soft shadow for depth
    shadowColor: '#74A3D7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  slideImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  cloudOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    zIndex: 2,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleDecoration: {
    width: 20,
    height: 2,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 8,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    // Softer Ghibli-palette colors
  },
});