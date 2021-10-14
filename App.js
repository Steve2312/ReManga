import { StatusBar } from 'expo-status-bar';
import React from 'react';

import Search from './src/screens/Search';
import Library from './src/screens/Library';
import Manga from './src/screens/Manga';
import Read from './src/screens/Read';

import theme from './src/theme';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';

// Tab Navigator containing the Search and Library
const Home = () => {
    const Tab = createBottomTabNavigator();

    const screenOptions = ({ route }) => {
        return {
            tabBarIcon: ({focused, size, color}) => {
                const iconName = () => {
                    switch(route.name) {
                        case 'Search':
                            return focused ? 'ios-search' : 'ios-search-outline';
                        case 'Library':
                            return focused ? "ios-bookmark" : "ios-bookmark-outline";
                        case 'Settings':
                            return focused ? "ios-settings" : "ios-settings-outline";
                        default:
                            return focused ? 'square' : 'square-outline';
                    }
                }
                return <Ionicons name={iconName()} size={size} color={color} />
            },
        }
    }

    return (
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen name="Search" component={Search} options={{headerTitle: "ReManga"}}/>
            <Tab.Screen name="Library" component={Library} options={{headerTitle: "Library"}}/>
        </Tab.Navigator>
    );
}

const MangaNavigator = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator>
            <Stack.Screen name="Manga" component={Manga} options={{headerBackTitle: "Back"}}/>
            {/* <Stack.Screen name="Chapters" component={Chapters} options={{headerBackTitle: "Back"}}/>
            <Stack.Screen name="MangaReader" component={Manga} options={{headerBackTitle: " "}}/> */}
            <Stack.Screen name="Read" component={Read} options={{headerBackTitle: "Back"}}/>
        </Stack.Navigator>
    );
}

const App = () => {
    const Stack = createStackNavigator();
    return (
        <>
            <StatusBar style="light" />

            <NavigationContainer theme={theme}> 
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
                    <Stack.Screen name="MangaNavigator" component={MangaNavigator} options={{headerShown: false}}/>
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
}

export default App;
