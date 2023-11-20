import React from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext } from 'react';
import { AuthContext } from "../context/AuthContext.js";

export default function Notificacao() {
  const { notificationCount, increaseNotificationCount } = useContext(AuthContext);

  const handlePress = () => {
    console.log(notificationCount)
    increaseNotificationCount();
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{ marginRight: 10 }}>
      <MaterialCommunityIcons name="bell-outline" size={24} color="#000" />
    </TouchableOpacity>
  );
};
