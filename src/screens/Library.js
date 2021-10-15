import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import Card from '../components/Card';
import theme from '../theme';
import BookmarkService from '../services/BookmarkService';

function Library ({navigation}) {
    const [bookmarks, setBookmarks] = useState(BookmarkService.getBookmarks());

    useEffect(() => {
        BookmarkService.addState(setBookmarks);
    },[]);

    return (
        <>
            <FlatList
                indicatorStyle={theme.dark ? "white": "dark"}
                data={bookmarks}
                keyExtractor={item => item.id + item.title}
                renderItem={({item}) => {
                    return (
                        <TouchableWithoutFeedback onPress={() => navigation.navigate("MangaNavigator", {screen: "Manga", params: {manga: item}})}>
                            <View>
                            <Card item={item} />
                            </View>
                        </TouchableWithoutFeedback>
                    );
                }}
                windowSize={5}
                getItemLayout={(data, index) => ({index, length: 150, offset: index * (150 + 10)})}
                ItemSeparatorComponent={() => <View style={{height: 10}}/>}
                contentContainerStyle={styles.contentContainerStyle}
            />
        </>
    )
}

const styles = StyleSheet.create({
    contentContainerStyle: {
        padding: 10
    },
    activityIndicator: {
        padding: 10
    }
});

export default Library;