import AsyncStorage from '@react-native-async-storage/async-storage';

const history = {};
var isLoaded = false;
const states = [];
const storageKey = "history";

function addChapter(manga_id, chapter_id) {
    if (!Object.keys(history).includes(manga_id)) {
        history[manga_id] = {
            readChapters: []
        }
    }

    history[manga_id].readChapters.push(chapter_id);
    storeData(history);
    notify();
}

function removeChapter(manga_id, chapter_id) {
    if (Object.keys(history).includes(manga_id)) {
        const index = history[manga_id].readChapters.indexOf(chapter_id);
        if (index > -1) {
            history[manga_id].readChapters.splice(index, 1);
        }
    }
    storeData(history);
    notify();
}

function hasRead(manga_id, chapter_id) {
    if (Object.keys(history).includes(manga_id)) {
        return history[manga_id].readChapters.includes(chapter_id);
    }

    return false;
}

async function loadHistory() {
    if (!isLoaded) {
        const value = await retrieveData();
        if (value) {
            const data = JSON.parse(value);
            const keys = Object.keys(data);
            for (let i = 0; i < keys.length; i++) {
                const manga_id = keys[i];
                history[manga_id] = data[manga_id];
            }
        } else {
            await storeData({});
        }

        isLoaded = true;
    }
}

async function storeData(value) {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(storageKey, jsonValue)
    } catch (e) {
        console.log(e);
    }
}

async function retrieveData() {
    try {
        return await AsyncStorage.getItem(storageKey);
    } catch (e) {
        console.log(e);
    }
}

function addState(state) {
    states.push(state);
}

function removeState(state) {
    const index = states.indexOf(state);
    if (index > -1) {
        states.splice(index, 1);
    }
}

function notify() {
    for (let i = 0; i < states.length; i++) {
        const setState = states[i];
        setState({...getObject()});
    }
}

function getObject() {
    return history;
}

async function clear() {
    await storeData(storageKey, {});
    notify();
}

export default { addChapter, addState, removeState, getObject, loadHistory, hasRead, removeChapter, clear};