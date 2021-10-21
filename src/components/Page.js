import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Image } from "react-native";
import { PinchGestureHandler, ScrollView } from "react-native-gesture-handler";

function Page({ width, uri }) {

    const [imageWidth, setImageWidth] = useState(0);
    const [imageHeigth, setImageHeight] = useState(0);

    const isMounted = useRef(true);

    useEffect(() => {
        Image.getSize(uri, (width, height) => {
            if (isMounted.current) {
                setImageWidth(width);
                setImageHeight(height);
            }
        });

        return () => isMounted.current = false;
    },[]);

    const styles = StyleSheet.create({
        container: {
            width: width,
            maxWidth: width,
            overflow: "hidden"
        },
        image: {
            width: width,
            aspectRatio: imageWidth && imageHeigth ? imageWidth / imageHeigth : null,
            zIndex: 100,
        },
        activityIndicator: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        }
    });

    return (
        <>
            <ActivityIndicator style={styles.activityIndicator} size="large" />
            <ScrollView
                style={styles.container}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                maximumZoomScale={2}
                minimumZoomScale={1}
                zoomScale={1}
                bouncesZoom={true}
                bounces={false}
                centerContent={imageWidth && imageHeigth}
            >
                <Image
                    style={styles.image}
                    source={{uri: uri}}
                />
            </ScrollView>
        </>
    );
}

export default Page;