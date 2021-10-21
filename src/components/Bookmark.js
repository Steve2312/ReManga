import React, { useState } from 'react';
import * as Haptics from 'expo-haptics';
import Button from './Button';
import BookmarkService from '../services/BookmarkService';

const BookmarkButton = ({ manga }) => {

    const [bookmarked, setBookmarked] = useState(BookmarkService.isBookmarked(manga));

    const bookmark = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        if (bookmarked) {
            BookmarkService.removeBookmark(manga);
        } else {
            BookmarkService.addBookmark(manga);
        }
        
        setBookmarked((isBookmarked) => !isBookmarked);
    };

    return <Button title={bookmarked ? 'Bookmarked' : 'Bookmark'} icon={bookmarked ? 'ios-bookmark' : 'ios-bookmark-outline'} onPress={bookmark} active={bookmarked} />;
};

export default BookmarkButton;
