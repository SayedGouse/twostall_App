import React, { useEffect } from "react";
import StackNavigation from "../src/StackNavigation"; // Import the stack navigator
import { GestureHandlerRootView } from "react-native-gesture-handler";


export default function index() {
  return (
    <GestureHandlerRootView  >
      <StackNavigation  />
    </GestureHandlerRootView>
  );
}
