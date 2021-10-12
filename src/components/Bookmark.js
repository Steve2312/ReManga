import React, { useState } from 'react';
import * as Haptics from 'expo-haptics';
import Button from './Button';

const BookmarkButton = ({ id }) => {
    // if id in library...
    const [bookmarked, setBookmarked] = useState(false);

    const bookmark = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setBookmarked((isBookmarked) => !isBookmarked);
    };

    return <Button title={bookmarked ? 'Bookmarked' : 'Bookmark'} icon={bookmarked ? 'ios-bookmark' : 'ios-bookmark-outline'} onPress={bookmark} active={bookmarked} />;
};

export default BookmarkButton;
