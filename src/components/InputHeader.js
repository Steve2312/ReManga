import React, { useEffect, useState } from "react";
import theme from '../theme';
import { TextInput, StyleSheet, View, TouchableOpacity } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

const InputHeader = ({callback}) => {
    const [value, setValue] = useState("");

    useEffect(() => {
        callback ? callback(value) : null;
    }, [value])

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <Ionicons name="ios-search" size={15} color={theme.colors.subtext} style={styles.icon}/>
                <TextInput
                    style={styles.input}
                    multiline={false}
                    placeholder="Search"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor={theme.colors.subtext}
                    keyboardAppearance={theme.dark ? "dark" : "white"}
                    onChange={(event) => setValue(event.nativeEvent.text)}
                    value={value}
                />
                {value ? <TouchableOpacity onPress={() => setValue("")}><Ionicons name="ios-close-circle" size={15} color={theme.colors.subtext} style={styles.icon}/></TouchableOpacity> : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.card,
        padding: 10,
    },
    wrapper: {
        backgroundColor: theme.colors.section,
        borderRadius: 10,
        flexDirection: 'row'
    },
    input: {
        flex: 1,
        color: theme.colors.subtext
    },
    icon: {
        padding: 10
    }
});

export default InputHeader; 