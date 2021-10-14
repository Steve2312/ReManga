import React from "react";
import theme from "../theme";
import { StyleSheet, View, Text, Image } from "react-native";

class ChapterCard extends React.PureComponent {

    constructor(props) {
        super(props);
        this.item = props.item;
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.top}>
                    <View style={styles.header}>
                        <Image style={styles.flag} source={require("../../assets/flags/en.png")}/>
                        <Text style={styles.title} numberOfLines={1} >Chapter {this.item.chapter}{this.item.volume ? " - Volume " + this.item.volume : null}</Text>
                    </View>
                    <Text style={styles.text} numberOfLines={1} >{this.item.title || "No title"}</Text>
                </View>
                <View style={styles.bottom}>
                    <Text style={styles.group} numberOfLines={1} >{this.item.group?.name || "No group name"}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    top: {
        paddingTop: 15,
        paddingHorizontal: 15,
        paddingBottom: 10,
    },
    bottom: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: theme.colors.bar
    },
    container: {
        justifyContent: "center",
        marginHorizontal: 25,
        backgroundColor: theme.colors.section,
        borderRadius: 10,
        flex: 1,
        overflow: 'hidden'
    },
    header: {
        flexDirection: 'row',
        alignItems: "center",
        marginBottom: 5
    },
    title: {
        color: theme.colors.text,
        textTransform: "capitalize",
        overflow: "hidden",
        fontWeight: '500',
        fontSize: 14,
    },
    text: {
        color: theme.colors.subtext,
        fontWeight: '400',
        fontSize: 14,
    },
    group: {
        color: theme.colors.subtext,
        fontWeight: '500',
        fontSize: 14,
    },
    flag: {
        width: 20,
        height: 15,
        marginRight: 5
    },
    line: {
        height: 0.2,
        opacity: 0.5,
        backgroundColor: theme.colors.text,
        marginVertical: 5,
    }
});

export default ChapterCard; 