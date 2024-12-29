import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { RefreshControl } from "react-native-gesture-handler";
import { Base_url } from "./Base_URL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from 'react-native-vector-icons/MaterialIcons';

const Details = ({ navigation }) => {
  const [email, setEmail] = useState();
  const [appointment, setAppointment] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getEmail = async () => {
    try {
      AsyncStorage.getItem("email").then((email) => {
        setEmail(email);
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  
  useEffect(() => {
    getEmail();
  }, []);

  const getAppointment = async () => {
    try {
      const response = await axios.post(
        `${Base_url}/api/userAppointment/getAllAppointment`,
        { Email: email }
      );

      setAppointment(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

 


  useEffect(() => {
    getAppointment();
  }, [email]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      getAppointment();
      setRefreshing(false);
    }, 2000);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return styles.bgSuccess;
      case "Denied":
        return styles.bgDanger;
      case "Not Attended":
        return styles.bgDark;
      case "Completed":
        return styles.bgPrimary;
      default:
        return styles.bgSecondary;
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this appointment?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const response = await axios.post(
                `${Base_url}/api/userAppointment/getAppointmentDelete`,
                { Id: id }
              );
              console.log("delete", response.data);
              // Refresh the appointments list after deletion
              getAppointment();
            } catch (error) {
              console.log("error", error);
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.scrollContainer}
      >
        <Text style={styles.listHeader}>Upcoming Appointments</Text>

        {/* Appointment Listing (for user) */}
        {appointment.length > 0 ? (
          appointment.map((item, index) => {
            return (
              <View key={index} style={styles.appointmentCard}>
                {/* Status Overlay */}
                <View style={[styles.statusContainer, getStatusStyle(item.Status)]}>
                  <Text style={styles.statusText}>{item.Status}</Text>
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.cardText}>
                    <Text style={styles.label}>Name:</Text> {item.FullName}
                  </Text>
                  <Text style={styles.cardText}>
                    <Text style={styles.label}>Contact:</Text> {item.PhoneNo}
                  </Text>
                  <Text style={styles.cardText}>
                    <Text style={styles.label}>Date:</Text> {item.Date_of_Appointment}
                  </Text>
                  <Text style={styles.cardText}>
                    <Text style={styles.label}>Time:</Text> {item.Time_of_Appointment}
                  </Text>
                  <Text style={styles.cardText}>
                    <Text style={styles.label}>Reason:</Text> {item.Reason_for_booking}
                  </Text>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("changeappointment", { id: item._id })}
                  >
                    <Text style={styles.buttonText}>Change Appointment</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item._id)}
                  >
                    <Icon name="delete" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.noAppointmentsText}>No upcoming appointments</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    padding: 20,
  },
  listHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  appointmentCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    padding: 15,
  },
  cardText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#ff0000",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  noAppointmentsText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 50,
  },
  statusContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    zIndex: 10,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  bgSuccess: {
    backgroundColor: "#28a745",
  },
  bgDanger: {
    backgroundColor: "#dc3545",
  },
  bgDark: {
    backgroundColor: "black",
  },
  bgPrimary: {
    backgroundColor: "#007bff",
  },
  bgSecondary: {
    backgroundColor: "#6c757d",
  },
  cardActions: {
    flexDirection: "row",
  },
});