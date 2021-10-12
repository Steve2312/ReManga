import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet} from 'react-native';
import InputHeader from '../components/InputHeader';
import SearchService from '../services/SearchService';
import theme from '../theme';

function Search ({navigation}) {
    const [state, setState] = useState(SearchService.getObject());

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

    return (
        <>
            <InputHeader callback={SearchService.search} />
            <Text style={{color: theme.colors.text}}>{JSON.stringify(state)}</Text>
        </>
    )
}

const styles = StyleSheet.create({
    activityIndicator: {
        padding: 10
    }
});

export default Search;