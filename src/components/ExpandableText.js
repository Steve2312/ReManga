import React, { useState } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import theme from '../theme';

const ExpandableText = ({style, initialLines, text}) => {

    const styles = StyleSheet.create({
        more: {
            color: theme.colors.primary,
            fontWeight: '600',
            fontSize: 15
        }
    });

    const [isExpanded, setExpanded] = useState(false)

    const toggle = () => {
        setExpanded(isExpanded => !isExpanded);
    }

    return (
        <>
            <TouchableWithoutFeedback onPress={toggle}>
                    <Text style={style} numberOfLines={isExpanded ? null : initialLines}>{text}</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={toggle}>
                    <Text style={styles.more}>{isExpanded ? "Less" : "More"}</Text>
            </TouchableWithoutFeedback>
        </>
    );
}

export default ExpandableText;