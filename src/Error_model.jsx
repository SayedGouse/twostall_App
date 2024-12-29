
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";


const Error_model = ({errorMessage, onClose , isVisible }) => {
   
   
  return (
  
       

        <Modal
             animationType="fade"
             transparent={true}
             visible={isVisible}
             onRequestClose={onClose}
           >
             <View style={styles.overlay}>
               <View style={styles.modalContainer}>
                 <Text style={styles.thankYouText}>
                 {errorMessage}
                 </Text>
                 
       
                 <Pressable style={styles.closeButton} onPress={onClose}>
                   <Text style={styles.closeButtonText}>Close</Text>
                 </Pressable>
               </View>
             </View>
           </Modal>
   
  )
}

export default Error_model

const styles = StyleSheet.create({
  
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
      },
      modalContainer: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      thankYouText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
      },
      feedbackText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: "center",
      },
      closeButton: {
        backgroundColor: "#007BFF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
      },
      closeButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
      },
})