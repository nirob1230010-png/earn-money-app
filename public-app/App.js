import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import Splash from './src/screens/Splash';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import MainTabs from './src/navigation/MainTabs';
import TaskDetail from './src/screens/TaskDetail';
import Withdraw from './src/screens/Withdraw';
import Surveys from './src/screens/Surveys';
import SurveyWebView from './src/screens/SurveyWebView';
import Bonus from './src/screens/Bonus';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: '#060818' },
          }}
        >
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="TaskDetail" component={TaskDetail} />
          <Stack.Screen name="Withdraw" component={Withdraw} />
          <Stack.Screen name="Surveys" component={Surveys} />
          <Stack.Screen name="SurveyWebView" component={SurveyWebView} />
          <Stack.Screen name="Bonus" component={Bonus} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  );
}
