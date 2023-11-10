import React, {useState, useEffect} from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';

interface UploadButtonProps {
  disabled: boolean;
  dirName: string; // Add these props
  channel: string; // Add these props
}

const UploadButton: React.FC<UploadButtonProps> = ({
  disabled,
  dirName,
  channel,
}) => {
  const [buttonColor, setButtonColor] = useState<string>('#2d2d2d'); // Default color

  useEffect(() => {
    // Update color when disabled prop changes
    setButtonColor(disabled ? '#2d2d2d' : '#007AFF'); // Use your desired enabled color
  }, [disabled]);

  const handlePress = async (): Promise<void> => {
    try {
      if (dirName && channel) {
        const response = await fetch(
          'http://192.168.4.75:3000/api/uploadFiles',
          {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              channel: channel,
              dirName: dirName,
            }),
          },
        );

        if (response.ok) {
          console.log('Upload successful!');
          console.log(await response.text());
        } else {
          console.log('Upload failed!');
        }
      } else {
        console.log('Please select both a folder and a channel.');
      }
    } catch (error) {
      console.log('Error uploading file:', error);
    }
  };

  return (
    <Pressable
      style={[styles.button, {backgroundColor: buttonColor}]}
      onPress={handlePress}>
      <Text style={styles.baseText}>Upload</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 200,
    width: 300,
    color: 'white',
    backgroundColor: '#2d2d2d',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 1,
  },

  baseText: {
    fontSize: 18,
    fontFamily: 'System',
    textAlign: 'center',
  },
});

export default UploadButton;
