import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Image, useWindowDimensions } from 'react-native';
import Page from '../components/Page';
import { requestBaseURL } from '../services/RequestService';
import theme from '../theme';

const Read = ({ route, navigation }) => {
    const chapter = route.params.chapter;
    const [pages, setPages] = useState([]);

    const dimensions = useWindowDimensions();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Chapter " + chapter.chapter,
        });

        const resolvePageURLs = async () => {
            const baseURL = await requestBaseURL(chapter.id);
            const pages = chapter.pages.map(page => {
               return baseURL + '/data/' + chapter.hash + "/" + page;
            });
            setPages([...pages]);
        }

        resolvePageURLs()
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={pages}
                indicatorStyle={theme.dark ? 'white' : 'black'}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item}
                horizontal
                disableIntervalMomentum
                inverted
                pagingEnabled
                snapToInterval={dimensions.width}
                snapToAlignment="center"
                removeClippedSubviews
                decelerationRate={0}
                getItemLayout={(data, index) => ({
                    length: dimensions.width,
                    offset: dimensions.width * index,
                    index
                })}
                renderItem={({item}) => {
                    return (
                        <Page width={dimensions.width} uri={item}/>
                    );
                }}
                style={styles.flatlistStyle}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    flatlistStyle: {
        flex: 1,
    }
});

export default Read;