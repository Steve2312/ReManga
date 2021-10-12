import React from "react";
import theme from "../theme";
import { StyleSheet, View, Text } from "react-native";
import CachedImage from "../components/CachedImage";
import StatusBadge from "./StatusBadge";

class Card extends React.Component {

    constructor(props) {
        super(props);
        this.item = props.item;
    }

    render() {
        const { id, status, title, cover, description } = this.item;

        const coverURL = `https://uploads.mangadex.org/covers/${id}/${cover.fileName}.256.jpg`;

        return (
            <View style={styles.container}>
                <CachedImage style={styles.background} source={{uri: coverURL}} cacheKey={cover.id}/>
            
                <CachedImage style={styles.cover} source={{uri: coverURL}} cacheKey={cover.id}/>
                
                <View style={styles.wrapper}>
                    <Text style={styles.title} numberOfLines={2}>{title}</Text>
                    <StatusBadge status={status} />
                    <Text style={styles.description} numberOfLines={10}>{description}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 150,
        flexDirection: 'row',
        backgroundColor: theme.colors.section,
    },
    wrapper: {
        flex: 1,
        margin: 10,
    },
    cover: {
        height: 150,
        width: 100,
        borderRadius: 5,
        
    },
    background: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        opacity: 0.05,
    },
    title: {
        color: theme.colors.title,
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 7,
    },
    description: {
        color: theme.colors.subtext,
        fontSize: 12,
        flexShrink: 1,
        overflow: "hidden"
    },
});

export default Card; 