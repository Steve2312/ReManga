import React, { useEffect, useState, useRef } from 'react';
import { Image } from 'react-native';
import * as FileSystem from 'expo-file-system';
import PropTypes from 'prop-types';

const CachedImage = props => {
    const { source: { uri }, cacheKey} = props;
    const cacheURI = `${FileSystem.cacheDirectory}${cacheKey}`;
    const [imageURI, setImageURI] = useState(null);
    const componentIsMounted = useRef(true);

    useEffect(() => {
        const setImage = uri => {
            if (componentIsMounted.current) {
                setImageURI(uri);
            }
        }

        const loadImage = async (fileURI) => {
            const cacheDirectory = await FileSystem.getInfoAsync(fileURI);
            if (!cacheDirectory.exists) {
                FileSystem.downloadAsync(uri, fileURI).then(() => {
                    setImage(fileURI);
                });
                setImage(uri);
            } else {
                setImage(cacheURI);
            }
        }

        loadImage(cacheURI);

        return () => componentIsMounted.current = false;
    }, []);

    return (
        <Image {...props} source={{ uri: imageURI }}/>
    );
}

CachedImage.propTypes = {
  source: PropTypes.object.isRequired,
  cacheKey: PropTypes.string.isRequired
}

export default CachedImage;