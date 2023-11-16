// CustomModal.js

import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import Button from './button';

export default function CustomModal ({ visible, onClose, action ,children }){
    const handleClose = () => {
        onClose();
        if (action) {
            action();
        }
      };
    
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={handleClose}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>{children}</Text>
              <Button onPress={handleClose}>
                OK
              </Button>
            </View>
          </View>
        </Modal>
      );
    };

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});


