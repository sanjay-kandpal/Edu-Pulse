// App.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Header } from '@/app/components/Headers';

// Define interface for selected files
interface SelectedFile {
  name: string;
  uri: string;
  mimeType?: string;
  size?: number;
}

const BASE_URL = 'https://book-processing-hwbqcfaugqd4anes.southindia-01.azurewebsites.net';
console.log(BASE_URL);

const index = () => {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  const [processStatus, setProcessStatus] = useState('');
  const [response, setResponse] = useState('');
  const [sourceDocuments, setSourceDocuments] = useState<Array<{content: string, metadata?: any}>>([]);
  const [showResponse, setShowResponse] = useState(false);
  const [showSourceDocs, setShowSourceDocs] = useState(false);

  // Pick PDF files using expo-document-picker (works on Web and Native)
  const pickPDFs = async () => {
    try {
      // Multiple selection is supported on web and most native platforms
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        multiple: true,
        copyToCacheDirectory: true,
      });
      
      if (result.canceled) {
        // User cancelled the picker
        return;
      }
      
      // Convert the result to our SelectedFile format
      const files: SelectedFile[] = result.assets.map(asset => ({
        name: asset.name ?? 'unnamed.pdf',
        uri: asset.uri,
        mimeType: asset.mimeType ?? 'application/pdf',
        size: asset.size,
      }));
      
      setSelectedFiles(files);
      console.log('Selected files:', files);
    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert('Error', 'Failed to pick documents');
    }
  };

  const processPDFs = async () => {
    if (selectedFiles.length === 0) {
      Alert.alert('Please select PDF files to process');
      return;
    }

    setIsProcessing(true);
    setProcessStatus('Processing PDFs...');

    try {
      // Create form data for uploading the files
      const formData = new FormData();
      
      // Log the structure we're trying to send
      console.log('Preparing to upload files:', selectedFiles.map(f => f.name));
      
      // Append each selected file to the form data
      for (const file of selectedFiles) {
        // IMPORTANT: The field name 'pdfFiles' must match what the server expects
        // Some servers are case-sensitive with form field names
        // For web: fetch the file content and create a proper File object
        if (Platform.OS === 'web') {
          try {
            // For web, we need to create a proper File object
            const response = await fetch(file.uri);
            const blob = await response.blob();
            const fileObject = new File([blob], file.name, { type: file.mimeType });
            formData.append('pdfFiles', fileObject);
            console.log(`Appended web file: ${file.name}`);
          } catch (error) {
            console.error('Error preparing web file:', error);
          }
        } else {
          // For native platforms
          // The uri is something like 'file://' or 'content://'
          formData.append('pdfFiles', {
            uri: file.uri,
            name: file.name,
            type: file.mimeType,
          } as any);
          console.log(`Appended native file: ${file.name}, URI: ${file.uri.substring(0, 30)}...`);
        }
      }

      // Add log to check formData (this is limited but helpful)
      if (Platform.OS === 'web') {
        // On web, we can inspect form data entries
        for (const pair of (formData as any).entries()) {
          console.log('FormData entry:', pair[0], pair[1].name);
        }
      }

      console.log('Sending form data to process endpoint');
      const response = await axios.post(`${BASE_URL}/process`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Avoid axios setting a boundary that might confuse the server
          // Let the browser set the multipart boundary automatically
        },
        // Important for larger files
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });
      
      setProcessStatus('PDFs processed successfully!');
      console.log('Process response:', response.data);
    } catch (error: any) {
      console.error('Error processing PDFs:', error);
      // More detailed error logging
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.error('Server response error:', 
          error.response.status, 
          error.response.data
        );
        setProcessStatus(`Error ${error.response.status}: ${JSON.stringify(error.response.data) || 'Server error'}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        setProcessStatus('Error: No response from server');
      } else {
        // Something else happened in setting up the request
        setProcessStatus(`Error: ${error.message || 'Failed to process PDFs'}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const queryDocuments = async () => {
    if (!query.trim()) {
      Alert.alert('Please enter a query');
      return;
    }

    setIsQuerying(true);
    setShowResponse(false);
    setShowSourceDocs(false);

    try {
      console.log('Sending query:', query);
      const response = await axios.post(`${BASE_URL}/query`, {
        query: query,
      });

      console.log('Query response:', response.data);

      if (response.data.results && response.data.results.length > 0) {
        setResponse(response.data.results[0]);
        setShowResponse(true);

        const docs = response.data.results.map((content: string, index: number) => {
          const doc: {content: string, metadata?: any} = { content };
          if (response.data.metadata && response.data.metadata[index]) {
            doc.metadata = response.data.metadata[index];
          }
          return doc;
        });

        setSourceDocuments(docs);
        setShowSourceDocs(true);
      } else {
        setResponse('No relevant information found.');
        setShowResponse(true);
        setShowSourceDocs(false);
      }
    } catch (error: any) {
      console.error('Error querying documents:', error);
      
      // Enhanced error reporting
      if (error.response) {
        setResponse(`Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        setResponse('Error: No response from server');
      } else {
        setResponse(`Error: ${error.message || 'Failed to query documents'}`);
      }
      
      setShowResponse(true);
      setShowSourceDocs(false);
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Book AI Assistant</Text>
      </View>
      <Text style={styles.title}>PDF Q&A Assistant</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Upload PDF Files</Text>
        <View style={styles.filePickerContainer}>
          <Text>
            {selectedFiles.length > 0
              ? `Selected ${selectedFiles.length} file(s)`
              : 'No files selected'}
          </Text>
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={pickPDFs}
          >
            <Text style={styles.buttonText}>Select PDFs</Text>
          </TouchableOpacity>
        </View>
        {selectedFiles.length > 0 && (
          <View style={styles.fileList}>
            {selectedFiles.map((file, index) => (
              <Text key={index} style={styles.fileName}>
                {file.name} {file.size ? `(${(file.size / 1024).toFixed(1)} KB)` : ''}
              </Text>
            ))}
          </View>
        )}
        <TouchableOpacity
          style={[
            styles.buttonPrimary,
            (isProcessing || selectedFiles.length === 0) && styles.buttonDisabled,
          ]}
          onPress={processPDFs}
          disabled={isProcessing || selectedFiles.length === 0}
        >
          <Text style={styles.buttonText}>Process PDFs</Text>
        </TouchableOpacity>
        {isProcessing && <ActivityIndicator style={styles.spinner} />}
        {processStatus ? <Text style={styles.statusText}>{processStatus}</Text> : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Ask a Question</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your query"
          value={query}
          onChangeText={setQuery}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.buttonPrimary,
            isQuerying && styles.buttonDisabled,
          ]}
          onPress={queryDocuments}
          disabled={isQuerying}
        >
          <Text style={styles.buttonText}>Query Documents</Text>
        </TouchableOpacity>
        {isQuerying && <ActivityIndicator style={styles.spinner} />}
      </View>

      {showResponse && (
        <View style={styles.responseSection}>
          <Text style={styles.sectionTitle}>Response</Text>
          <Text style={styles.responseText}>{response}</Text>
        </View>
      )}

      {showSourceDocs && (
        <View style={styles.sourceDocsSection}>
          <Text style={styles.sectionTitle}>Source Documents</Text>
          {sourceDocuments.map((doc, index) => (
            <View key={index} style={styles.sourceDoc}>
              <Text style={styles.sourceDocTitle}>Source Document {index + 1}:</Text>
              <Text>{doc.content}</Text>
              {doc.metadata && (
                <View style={styles.metadata}>
                  {Object.entries(doc.metadata).map(([key, value], i) => (
                    <Text key={i}>
                      <Text style={styles.metadataKey}>{key}: </Text>
                      <Text>{String(value)}</Text>
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  fileList: {
    marginBottom: 10,
  },
  fileName: {
    color: '#555',
    marginBottom: 2,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    minHeight: 40,
  },
  buttonPrimary: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  spinner: {
    marginTop: 10,
  },
  statusText: {
    marginTop: 5,
  },
  responseSection: {
    backgroundColor: '#f4f4f4',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  responseText: {
    lineHeight: 20,
  },
  sourceDocsSection: {
    backgroundColor: '#f4f4f4',
    padding: 15,
    borderRadius: 5,
  },
  sourceDoc: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  sourceDocTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  metadata: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  metadataKey: {
    fontWeight: 'bold',
  },
});

export default index;