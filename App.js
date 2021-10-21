import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';

import Search from './src/screens/Search';
import Cache from './src/screens/Cache';
import Manga from './src/screens/Manga';
import Read from './src/screens/Read';
import Library from './src/screens/Library';

import theme from './src/theme';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import BookmarkService from './src/services/BookmarkService';
import HistoryService from './src/services/HistoryService';

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
                        case 'Cache':
                            return focused ? "ios-settings" : "ios-settings-outline";
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
            <Tab.Screen name="Cache" component={Cache} options={{headerTitle: "Cache"}}/>
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

    useEffect(() => {
        BookmarkService.loadService();
        HistoryService.loadHistory();
    },[]);

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
