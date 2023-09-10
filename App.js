
import {  NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Home from "./Home";
import Stop_page from "./Stop_page";


const Stack = createNativeStackNavigator();


export default function App() {

  return (
  <NavigationContainer>
  <Stack.Navigator>

    <Stack.Screen name="Home" 
    component={Home} 
    options={{title: "제때제때"}}>
    </Stack.Screen>

    <Stack.Screen 
    name="Stop_page" 
    component={Stop_page}
    options={({route}) => ({
      title: `${Object.keys(route.params)[0]}`,
    })}
    ></Stack.Screen>
    
  </Stack.Navigator>
  </NavigationContainer>
  )
}