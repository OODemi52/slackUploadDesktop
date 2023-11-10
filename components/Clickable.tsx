import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

interface ClickableProps {
  type: 'path' | 'channel' | 'upload';
  handleFolderChange: (text: string) => void; // Accepts a string argument
  handleChannelChange: (value: string) => void; // Accepts a string argument
  handleFileUpload?: () => void;
  state: {
    dirName: string;
    channel: string;
  };
}

const Clickable: React.FC<ClickableProps> = ({
  type,
  handleFolderChange,
  handleChannelChange,
  handleFileUpload,
  state,
}) => {
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [formattedOptions, setFormattedOptions] = useState([]);

  const fetchData = async (): Promise<void> => {
    try {
      const response = await fetch('http://192.168.4.75:3000/api/getChannels');
      const data = await response.json();
      setOptions(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch channels when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Format options when the component mounts or when options change
  useEffect(() => {
    const newFormattedOptions = options.map(option => ({
      label: option[1],
      value: option[0],
    }));
    console.log(newFormattedOptions);
    setFormattedOptions(newFormattedOptions);
  }, [options]);

  console.log(formattedOptions);

  if (type === 'path') {
    return (
      <View>
        <Text>{state.dirName === '' ? 'Choose Folder' : state.dirName}</Text>
        <TextInput
          placeholder="Choose Folder"
          onChangeText={text => handleFolderChange(text)} // Pass the text argument
        />
      </View>
    );
  }

  if (type === 'channel') {
    return (
      <>
        <DropDownPicker
          open={open}
          value={value}
          items={formattedOptions}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setFormattedOptions}
          placeholder="Choose Channel"
          theme="DARK"
        />
        <View>
          <Text>
            Channel: {value}{' '}
            {state.channel === '' ? 'Choose Channel' : state.channel}
          </Text>
        </View>
      </>
    );
  }

  if (type === 'upload') {
    return (
      <Button
        title="Upload"
        onPress={handleFileUpload}
        disabled={!state.dirName || !state.channel}
        color="#f194ff"
      />
    );
  }

  // Default case (optional)
  return null;
};

export default Clickable;
