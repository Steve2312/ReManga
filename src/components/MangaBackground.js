import React, { useRef } from 'react';
import { Animated} from 'react-native';
import CachedImage from '../components/CachedImage';

const MangaBackground = props => {
    const {uri, cacheKey} = props;

    const scroll_y = useRef(new Animated.Value(0)).current;

    const Background = () => {
        return (
            <Animated.View style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                opacity: 0.2,
                height: scroll_y.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [271, 270, 270]
                }),
                transform: [
                    {
                        translateY: scroll_y.interpolate({
                            inputRange: [-1, 0, 100],
                            outputRange: [0, 0, -50]
                        })
                    },
                    {
                        scale: scroll_y.interpolate({
                            inputRange: [-1000, 0, 1],
                            outputRange: [1.5, 1, 1]
                        })
                    }
                ]
            }}>
                <CachedImage 
                    style={{flex: 1}}
                    source={{uri: uri}}
                    cacheKey={cacheKey}
                    blurRadius={5}
                />
            </Animated.View>
        );
    };

    const scrollHandler = ({ nativeEvent }) => {
        Animated.timing(scroll_y, {
            toValue: nativeEvent.contentOffset.y,
            duration: 0,
            useNativeDriver: false,
        }).start();
    }

    return [Background, scrollHandler]
}

export default MangaBackground;