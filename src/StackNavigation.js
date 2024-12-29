import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../src/HomeScreen";
import Details from "../src/Details";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import ChangeAppointment from "./ChangeAppointment";
import Icon from 'react-native-vector-icons/MaterialIcons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppTabs = () => {
  return (
    <Tab.Navigator>
    <Tab.Screen
      name="Book_Appointment"
      component={HomeScreen}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Icon name="event" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Details"
      component={Details}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Icon name="list" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
  );
};

const StackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
      <Stack.Screen name="Register" options={{ headerShown: false }} component={RegisterScreen} />
      <Stack.Screen name="Notification" options={{ headerShown: false }} component={RegisterScreen} />
      <Stack.Screen
        name="Tab"
        options={{ headerShown: false }}
        component={AppTabs}
      />
      <Stack.Screen name="changeappointment" options={{ headerShown: false }} component={ChangeAppointment} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
