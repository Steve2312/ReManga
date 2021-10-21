import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import * as FileSystem from 'expo-file-system';
import theme from '../theme';
import BookmarkService from '../services/BookmarkService';
import HistoryService from '../services/HistoryService';

const Cache = () => {
    const cacheURI = `${FileSystem.cacheDirectory}`;

    const [cacheSize, setCacheSize] = useState(0);
    useEffect(() => {
        getCacheSize();
        const listener = setInterval(() => {
            getCacheSize();
        }, 1000);

        return () => clearInterval(listener);
    }, []);

    useEffect(() => {
        console.log("Updated cache")
    }, [cacheSize])

    const getCacheSize = async () => {
        const { size } = await FileSystem.getInfoAsync(cacheURI);
        setCacheSize(size / 1000000);
    }

    const cleanupCache = async () => {
        if (Platform.OS === 'ios') {
            const cachedFiles = await FileSystem.readDirectoryAsync(cacheURI);
            for (let index = 0; index < cachedFiles.length; index++) {
                const element = cachedFiles[index];
                await FileSystem.deleteAsync(`${cacheURI}${element}`)
            }
        }
    }
    const showCache = async () => {
        const cachedFiles = await FileSystem.readDirectoryAsync(cacheURI);
        console.log(cachedFiles)
    }

    return (
        <View>
            <Text style={{color: theme.colors.text}}>Cache size: {cacheSize} MB</Text>
            <Button onPress={cleanupCache} title="Clear Cache"></Button>
            <Button onPress={getCacheSize} title="Update Cache Size"></Button>
            <Button onPress={showCache} title="showCache"></Button>
            <Button onPress={() => BookmarkService.clear()} title="delete Library"></Button>
            <Button onPress={() => HistoryService.clear()} title="delete history"></Button>
        </View>
    )
}

export default Cache;