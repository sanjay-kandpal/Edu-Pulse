import { View, Text, FlatList, Image, TurboModuleRegistry } from 'react-native';
import React, { useEffect, useState } from 'react';
import GlobalApi from '../Shared/GlobalApi';

// Define interfaces based on the JSON structure
interface VideoDescription {
  type: string;
  children: {
    type: string;
    text: string;
  }[];
}

interface ImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: null;
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
  alternativeText: null;
  caption: null;
  width: number;
  height: number;
  formats: {
    thumbnail: ImageFormat;
    small: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: null;
  provider: string;
  provider_metadata: null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface VideoItem {
  id: number;
  documentId: string;
  title: string;
  description: VideoDescription[];
  videoUrl: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  Image: ImageData;
}

interface VideoListResponse {
  data: VideoItem[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Define the transformed data structure
interface VideoListItem {
  id: number;
  documentId: string;
  title: string;
  description: string;
  videoUrl: string;
  imageUrl: string;
}

export default function VideoCourseList() {
  const [videoList, setVideoList] = useState<VideoListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const BASE_URL = 'http://localhost:1337';
  useEffect(() => {
    getVideoCourse();
  }, []);

  const getVideoCourse = async() => {
    try {
      const resp = await GlobalApi.getVideoCourse();
      const result = resp.data.data.map((item: VideoItem) => ({
        id: item.id,
        documentId: item.documentId,
        title: item.title,
        description: item.description[0]?.children[0]?.text || '',
        videoUrl: item.videoUrl,
        // Use small format image URL with base URL prefix if needed
        imageUrl: item.Image ? `${BASE_URL}${item.Image.formats.small.url}` : 'https://via.placeholder.com/500x300'
      }));
      
      setVideoList(result);
      console.log(result);
    } catch (error) {
      console.error('Error fetching video courses:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Text style={{ fontSize: 20, fontWeight: 'bold',marginBottom: 30}}>Video Courses</Text>
          <FlatList
            data={videoList}
            keyExtractor={(item) => item.id.toString()}
            horizontal={TurboModuleRegistry}
            renderItem={({ item }) => (
              <View style={{ padding: 10, marginVertical: 5 }}>
                <Image 
                  source={{ uri: item.imageUrl }} 
                  style={{ width: '100%', height: 200, borderRadius: 8 }} 
                  resizeMode="cover"
                />
                <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 8 }}>{item.title}</Text>
                <Text style={{ marginTop: 4, color: '#666' }}>{item.description}</Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}