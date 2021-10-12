import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import theme from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Button = ({title, icon, onPress, active}) => {
    const styles = StyleSheet.create({
        buttonStyle: {
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            paddingVertical: 12,
            backgroundColor: active ? theme.colors.primary : theme.colors.section,
            borderRadius: 10,
            flex: 1,
        },
        buttonText: {
            color: theme.colors.text,
            textTransform: "capitalize",
            overflow: "hidden",
            fontWeight: '500',
            fontSize: 14,
        },
        buttonIcon: {
            color: theme.colors.text,
            fontSize: 19,
            marginRight: 5,
        },
    });

    return (
        <TouchableOpacity style={styles.buttonStyle} onPress={onPress}>
            {icon ? <Ionicons name={icon} style={styles.buttonIcon} /> : null}
            {title ? <Text style={styles.buttonText}>{title}</Text> : null}
        </TouchableOpacity>
    );
}

export default Button;