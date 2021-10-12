import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const StatusBadge = ({status}) => {
    const badgeStyle = getBadgeStyle(status);
    return (
        <View style={badgeStyle.badge} numberOfLines={1}>
            <Text style={badgeStyle.text}>{status}</Text>
        </View>
    );
}

const getBadgeStyle = (status) => {
    var width, backgroundColor;

    switch (status) {
        case "ongoing":
            width = 70;
            backgroundColor = "#62B544";
            break;
        case "hiatus":
            width = 60;
            backgroundColor = "#f79421";
            break;
        case "completed":
            width = 80;
            backgroundColor = "#3b86ff";
            break;
        case "cancelled":
            width = 75;
            backgroundColor = "#ff5858";
            break;
    }

    return StyleSheet.create({
        badge: {
            height: 20,
            justifyContent: "center",
            borderRadius: 10,
            width,
            backgroundColor,
            marginBottom: 7,
        },
        text: {
            color: "white",
            textAlign: "center",
            fontSize: 12,
            fontWeight: "600",
            textTransform: "capitalize",
        },
    });
};

export default StatusBadge;