import { View, Text, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView  } from 'react-native-gesture-handler';
import GlobalApi from '../Shared/GlobalApi';

// Define interfaces based on your JSON structure
interface ImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
}

interface ImageData {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail: ImageFormat;
    small: ImageFormat;
    medium?: ImageFormat;
    large?: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface CourseData {
  id: number;
  documentId: string;
  Name: string;
  type: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  Topic: string;
  Image: ImageData;
}

interface ApiResponse {
  data: CourseData[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Simplified course item for display
interface CourseItem {
  id: number;
  name: string;
  description: string;
  type: string;
  topic: string;
  image: string;
}

export default function CourseList() {
  const [courseList, setCourseList] = useState<CourseItem[]>([]);
  const BASE_URL = `http://${process.env.EXPO_PUBLIC_IP}:3000`;
  useEffect(() => {
    getCourseList();
  }, []);
  
  const getCourseList = async () => {
    try {
      const resp = await GlobalApi.getCourseList();
      const apiResponse: ApiResponse = resp.data;
      
      // Map the API data to the format needed for display
      const result = apiResponse.data.map((item) => ({
        id: item.id,
        name: item.Name,
        description: item.description,
        type: item.type,
        topic: item.Topic,
        image: item.Image?.url || ''
      }));
      
      console.log(result);
      setCourseList(result);
    } catch (error) {
      console.error("Error fetching course list:", error);
      setCourseList([]);
    }
  };
  
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>
        Courses
      </Text>
      <GestureHandlerRootView 
        data={courseList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ 
            marginRight: 15, 
            width: 220, 
            backgroundColor: '#f8f8f8', 
            borderRadius: 10,
            overflow: 'hidden',
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4
          }}>
            <Image 
              source={{ uri: `${BASE_URL}${item.image}` }} 
              style={{
                width: '100%',
                height: 120,
                resizeMode: 'cover'
              }}
            />
            <View style={{ padding: 10 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 5 }}>
                {item.name}
              </Text>
              <Text numberOfLines={2} style={{ color: '#555', marginBottom: 5 }}>
                {item.description.replace(/[#\-*]/g, '').substring(0, 80)}...
              </Text>
              <Text style={{ color: '#777', fontWeight: '500' }}>
                Topic: {item.topic}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}