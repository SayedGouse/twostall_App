import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Base_url } from './Base_URL';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Booking_model from './Booking_model';
import DateTimePicker from "@react-native-community/datetimepicker";
import Error_model from './Error_model';
import messaging from '@react-native-firebase/messaging';

const ChangeAppointment = ({ route, navigation }) => {
  const [idData, setIdData] = useState({});
  const [patientName, setPatientName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [reasonForBooking, setReasonForBooking] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorShow, setErrorShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const id = route.params.id;

  const getAppointmentById = async () => {
    try {
      const response = await axios.post(`${Base_url}/api/userAppointment/getAppointmentById`, { Id: id });
      setIdData(response.data);
    } catch (error) {
      console.error("Error fetching appointment by ID:", error);
    }
  };

  useEffect(() => {
    getAppointmentById();
  }, [id]);

  const handleConfirm = (event, selectedDate) => {
    setOpen(false); // Close the picker

 
      // Format the date (e.g., MM/DD/YYYY)
      const formatted = selectedDate.toLocaleDateString("en-US");
      setAppointmentDate(formatted);

  };

  useEffect(() => {
    setPatientName(idData.FullName || '');
    setContactNo(idData.PhoneNo ? idData.PhoneNo.toString() : '');
    setAppointmentDate(idData.Date_of_Appointment || '');
    setAppointmentTime(idData.Time_of_Appointment || '');
    setReasonForBooking(idData.Reason_for_booking || '');
  }, [idData]);

  const handleChangeSubmit = async () => {
    try {
        if (patientName && contactNo && appointmentDate && appointmentTime && reasonForBooking) {
       
           const response = await axios.post(`${Base_url}/api/userAppointment/getAppointmentUpdateById`, {
              FullName: patientName,
              PhoneNo: contactNo,
              Date_of_Appointment: appointmentDate,
              Time_of_Appointment: appointmentTime,
              Reason_for_booking: reasonForBooking,
              Id : id
            });
            if (response.status === 200) {
                setModalVisible(true);
                navigation.navigate("Tab", { screen: "Details" } );
              }
          } else {
            alert('Please fill all the fields');
          }
    } catch (error) {
        console.log("error",error);
        
        if (error.response && error.response.status === 404) {
            setErrorMessage("Appointment already booked for this time slot.");
            setErrorShow(true)
            
            
        }
    }
    
  };


  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };

  const getTokenAndSendToBackend = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('FCM Token:', fcmToken);
      try {
        await axios.post(`${Base_url}/api/save-fcm-token`, { token: fcmToken });
        console.log('Token sent to backend successfully');
      } catch (error) {
        console.error('Error sending token to backend:', error);
      }

      
    } else {
      console.log('Failed to get FCM token');
    }
  };

  useEffect(() => {
    requestUserPermission();
    getTokenAndSendToBackend();

    // Handle incoming foreground messages
    const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
      console.log('New Notification', remoteMessage.notification?.body);
    });

    return unsubscribeOnMessage;
  }, []);


  return (
    <ScrollView style={styles.container}>
        {
            errorShow ? (
                <Error_model isVisible={errorShow} errorMessage={errorMessage} onClose={() => setErrorShow(false)} />
             ) : (
                !modalVisible ? (
                    <View style={styles.form}>
                      <Text style={styles.header}>Change Your Appointment</Text>
            
                      {/* Patient Name */}
                      <Text style={styles.label}>Patient Name</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your name"
                        value={patientName}
                        onChangeText={(text) => setPatientName(text)}
                      />
            
                      {/* Contact Number */}
                      <Text style={styles.label}>Contact No.</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your contact number"
                        keyboardType="numeric"
                        value={contactNo}
                        onChangeText={(text) => setContactNo(text)}
                      />
            
                      {/* Date of Appointment */}
                      <Text style={styles.label}>Date of Appointment</Text>
            
                            <TouchableOpacity onPress={() => setOpen(true)}>
                            <TextInput
                                style={styles.input}
                                placeholder="Select appointment date"
                                value={appointmentDate}
                                onChangeText={(text) => setAppointmentDate(text)}
                                editable={false} // Prevent manual input
                            />
                            </TouchableOpacity>
            
                            {/* Show DateTimePicker only when `show` is true */}
                            {open && (
                            <DateTimePicker
                                value={new Date()}
                                mode="date"
                                display="default"
                                onChange={handleConfirm} // Callback when a date is selected
                            />
                            )}
            
                      {/* Time of Appointment */}
                      <Text style={styles.label}>Time of Appointment</Text>
                      <Picker
                        selectedValue={appointmentTime}
                        style={styles.picker}
                        onValueChange={(itemValue) => setAppointmentTime(itemValue)}
                      >
                        <Picker.Item label="Select Time Slot" value="" />
                        <Picker.Item label="9:00 AM" value="9:00 AM" />
                        <Picker.Item label="10:00 AM" value="10:00 AM" />
                        <Picker.Item label="11:00 AM" value="11:00 AM" />
                        <Picker.Item label="12:00 PM" value="12:00 PM" />
                        <Picker.Item label="1:00 PM" value="1:00 PM" />
                        <Picker.Item label="2:00 PM" value="2:00 PM" />
                        <Picker.Item label="3:00 PM" value="3:00 PM" />
                        <Picker.Item label="4:00 PM" value="4:00 PM" />
                        <Picker.Item label="5:00 PM" value="5:00 PM" />
                      </Picker>
            
                      {/* Reason for Booking */}
                      <Text style={styles.label}>Reason for Booking</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter reason for appointment"
                        value={reasonForBooking}
                        onChangeText={(text) => setReasonForBooking(text)}
                      />
            
                      {/* Submit Button */}
                      <TouchableOpacity style={styles.button} onPress={handleChangeSubmit}>
                        <Text style={styles.buttonText}>Submit Changes</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Booking_model isVisible={modalVisible} onClose={() => setModalVisible(false)} />
                  ) 
            )
        }
      
    </ScrollView>
  );
};

export default ChangeAppointment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    padding: 20,
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
