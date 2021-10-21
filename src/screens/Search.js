import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import Card from '../components/Card';
import InputHeader from '../components/InputHeader';
import SearchService from '../services/SearchService';
import theme from '../theme';

function Search ({navigation}) {
    const [state, setState] = useState(SearchService.getObject());
    const flatListRef = useRef();

    useEffect(() => {
        SearchService.addState(setState);
    },[]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                return state.isLoading ? <ActivityIndicator size="small" style={styles.activityIndicator}/> : null
            }
        });
    }, [state.isLoading])

    useEffect(() => {
        if (flatListRef && state.results.length <= 50) {
            flatListRef.current.scrollToOffset({ animated: false, offset: 0 });
        }
    },[state.results]);

    return (
        <>
            <InputHeader callback={SearchService.search} />
            <FlatList
                indicatorStyle={theme.dark ? "white": "dark"}
                data={state.results}
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
                onEndReached={SearchService.loadMore}
                getItemLayout={(data, index) => ({index, length: 150, offset: index * (150 + 10)})}
                ItemSeparatorComponent={() => <View style={{height: 10}}/>}
                contentContainerStyle={styles.contentContainerStyle}
                ref={flatListRef}
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

export default Search;