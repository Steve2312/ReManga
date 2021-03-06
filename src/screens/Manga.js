import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, Share, ActionSheetIOS} from 'react-native';
import MangaBackground from '../components/MangaBackground';
import CachedImage from '../components/CachedImage';
import Bookmark from '../components/Bookmark';
import Button from '../components/Button';
import ChapterService from '../services/ChapterService';
import ChapterCard from '../components/ChapterCard';
import theme from '../theme';
import StatusBadge from '../components/StatusBadge';
import ExpandableText from '../components/ExpandableText';
import HistoryService from '../services/HistoryService';


const Manga = ({ route, navigation }) => {
    const { id, title, status, description, genres, type, artist, author, cover, updatedAt } = route.params.manga;
    const cover_uri = `https://uploads.mangadex.org/covers/${id}/${cover.fileName}.256.jpg`;

    // Background Component with scrollHandler for the Animation
    const [Background, scrollHandler] = MangaBackground({ uri: cover_uri, cacheKey: cover.id });

    const [chapters, setChapters] = useState(ChapterService.getObject());

    // Change headerTitle to the title of the Manga
    useEffect(() => {
        navigation.setOptions({
            headerTitle: title,
        });

        ChapterService.addState(setChapters);
        ChapterService.loadChapters(id);

        return () => {
            ChapterService.removeState(setChapters);
        }
    },[]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                return chapters.isLoading ? <ActivityIndicator size="small" style={styles.activityIndicator}/> : null
            }
        });
    }, [chapters.isLoading])

    function share() {
        Share.share({
            title: title,
            message: "Check out " + title + " on MangaDex!",
            url: 'https://mangadex.org/title/' + id,
        });
    }


    function readChapter(chapter) {
        HistoryService.addChapter(id, chapter.id);
        navigation.navigate("MangaNavigator", {screen: "Read", params: {chapter: chapter}})
    }

    const openContextMenu = (chapter) => {
        const hasRead = HistoryService.hasRead(id, chapter.id);
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Cancel', hasRead ? 'Mark unread' : 'Mark read'],
                destructiveButtonIndex: hasRead ? 1 : null,
                cancelButtonIndex: 0,
                userInterfaceStyle: 'light'
            }, 
            (buttonIndex) => {
                if (buttonIndex === 1) {
                    if (!hasRead) {
                        HistoryService.addChapter(id, chapter.id);
                    } else {
                        HistoryService.removeChapter(id, chapter.id);
                    }
                }
            }
        );
    };

    return (
        <SafeAreaView style={styles.parentView}>
            <View style={styles.parentView}>
                <Background />
                <FlatList
                    onScroll={scrollHandler}
                    scrollEventThrottle={10}
                    indicatorStyle={theme.dark ? 'white' : 'black'}

                    ListHeaderComponent={() => {
                        return (
                            <>
                                <View style={styles.header}>
                                    <View style={styles.cover}>
                                        <CachedImage style={styles.cover} source={{ uri: cover_uri }} cacheKey={cover.id} />
                                    </View>
                                    <View style={styles.info}>
                                        <HeaderInformation title="Author: " text={author.name || '-'} />
                                        <HeaderInformation title="Artist: " text={artist.name || '-'} />
                                        <HeaderInformation title="Type: " text={type} />
                                    </View>
                                </View>
                                <View style={styles.container}>
                                    <StatusBadge status={status} />
                                    <Text style={styles.title}>{title}</Text>
                                    <Text style={styles.text}>{getUpdatedAt(updatedAt)}</Text>

                                    <Text style={styles.subject}>Genres</Text>
                                    <Text style={styles.text}>{genres}</Text>

                                    <Text style={styles.subject}>Description</Text>
                                    <ExpandableText style={styles.text} initialLines={5} text={description.trim()} />

                                    <Text style={styles.subject}>Chapters</Text>
                                </View>
                            </>
                        );
                    }}
                    data={chapters.results}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => {
                        return (
                            <TouchableOpacity onPress={() => readChapter(item)} onLongPress={() => openContextMenu(item)}>
                                <ChapterCard item={item} manga_id={id}/>
                            </TouchableOpacity>
                        );
                    }}
                    windowSize={7}
                    ItemSeparatorComponent={() => <View style={{height: 15}}/>}
                    getItemLayout={(data, index) => ({index, length: 101, offset: index * (101 + 15)})}
                    onEndReached={ChapterService.loadMore}
                    contentContainerStyle={{paddingBottom: 10}}
                />

                <View style={styles.footer}>
                    <View style={styles.row}>
                        <Bookmark manga={route.params.manga} />
                        <View style={{ width: 10 }} />
                        <Button title="Share" icon="ios-share-outline" onPress={share} />
                    </View>
                    <View style={{ height: 10 }} />
                    <View style={styles.row}>
                        <Button title="Read" icon="caret-forward" />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    parentView: {
        flex: 1,
        overflow: 'hidden',
    },
    header: {
        height: 270,
        overflow: 'hidden',
        flexDirection: 'row',
        padding: 25,
        alignItems: 'flex-start',
    },
    cover: {
        width: 140,
        height: '100%',
        shadowColor: theme.colors.shadow,
        shadowOpacity: 0.8,
        shadowRadius: 20,
        borderRadius: 5,
        overflow: 'hidden',
    },
    info: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    container: {
        backgroundColor: theme.colors.background,
        margin: 0,
        paddingHorizontal: 25,
        paddingTop: 25,
    },

    // Text
    title: {
        fontSize: 25,
        color: theme.colors.title,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    subject: {
        color: theme.colors.title,
        fontWeight: '600',
        fontSize: 16,
        marginTop: 15,
        marginBottom: 3,
    },
    text: {
        color: theme.colors.subtext,
        fontWeight: '400',
        fontSize: 14,
    },

    // footer
    footer: {
        flexDirection: 'column',
        backgroundColor: theme.colors.background,
        paddingHorizontal: 25,
        paddingTop: 10,
        borderTopColor: theme.colors.border,
        borderTopWidth: 0.5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    activityIndicator: {
        padding: 10
    }
});

const getUpdatedAt = (timestamp) => {
    if (!timestamp) {
        return null;
    }

    const date = new Date(timestamp);

    var hours = date.getHours();
    var minutes = date.getMinutes();

    const AMPM = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    minutes = minutes < 10 ? '0' + minutes : minutes;

    const getDifferenceInDays = () => {
        const delta_days = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 3600 * 24));

        switch (delta_days) {
            case 0:
                return 'Today';
            case 1:
                return 'Yesterday';
            default:
                return `${delta_days} days ago`;
        }
    };

    return `Last updated at: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}, ${hours}:${minutes} ${AMPM} (${getDifferenceInDays()})`;
};

const HeaderInformation = ({ title, text, numberOfLines }) => {
    const styles = StyleSheet.create({
        subject: {
            color: theme.colors.subtext,
            marginTop: 10,
            marginBottom: 2,
            fontWeight: '700',
            fontSize: 16,
        },
        value: {
            color: theme.colors.text,
            textTransform: 'capitalize',
            overflow: 'hidden',
            fontWeight: '500',
        },
    });

    return (
        <>
            <Text style={styles.subject}>{title}</Text>
            <Text style={styles.value} numberOfLines={numberOfLines}>
                {text}
            </Text>
        </>
    );
};

export default Manga;
