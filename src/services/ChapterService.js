const limit = 100;

import { createRequest, findIDByType } from "./RequestService";

function ChapterService() {
    this.isLoading = false;
    this.pageEnd = false;
    this.results = [];
    this.offset = 0;
    this.id = ""

    this.states = [];

    ChapterService.prototype.loadChapters = async id => {
        this.clear();

        this.isLoading = true;
        this.notify();

        const response = await createRequest(`/manga/${id}/feed`, {
            limit: limit,
            offset: 0,
            translatedLanguage: ['en'],
            order: {
                chapter: 'desc'
            }
        });

        const data = await this.resolve_ids(this.format(response));

        this.results = [...data];
        this.pageEnd = data.length < 100;
        this.offset = this.results.length;
        this.id = id;
        this.isLoading = false;
        this.notify();
    }

    ChapterService.prototype.loadMore = async () => {
        if (!this.pageEnd && !this.isLoading) {
            this.isLoading = true;
            this.notify();

            const response = await createRequest(`/manga/${this.id}/feed`, {
                limit: limit,
                offset: this.offset,
                translatedLanguage: ['en'],
                order: {
                    chapter: 'desc'
                }
            });

            const data = await this.resolve_ids(this.format(response));

            this.results = [...this.results, ...data];
            this.pageEnd = data.length < 100;
            this.offset = this.results.length;
            this.isLoading = false;
            this.notify();
        }
    }

    ChapterService.prototype.format = array => {
        const temp = [];

        for (let i = 0; i < array.length; i++) {
            const item = array[i];

            const group_id = findIDByType(item.relationships, "scanlation_group");
            const user_id = findIDByType(item.relationships, "user");
            
            const data = {
                id: item.id,
                title: item.attributes.title,
                volume: item.attributes.volume,
                chapter: item.attributes.chapter,
                pages: item.attributes.data,
            }

            if (group_id) {
                data = {...data, group: { id: group_id }}
            }

            if (user_id) {
                data = {...data, user: { id: user_id }}
            }

            temp.push(data);
        }

        return temp;
    }

    ChapterService.prototype.resolve_ids = async formatted_array => {
        const group_ids = [];
        const user_ids = [];

        for (let i = 0; i < formatted_array.length; i++) {
            const item = formatted_array[i];

            if (item.group) {
                group_ids.push(item.group.id);
            }

            if (item.user) {
                user_ids.push(item.user.id);
            }
        }

        const groupResponse = await createRequest('/group', {
            limit: limit,
            ids: group_ids,
        });

        for (let i = 0; i < groupResponse.length; i++) {
            const group = groupResponse[i];
            for (let y = 0; y < formatted_array.length; y++) {
                const item = formatted_array[y];
                if (item["group"] && group.id == item["group"]["id"]) {
                    formatted_array[y]["group"]["name"] = group.attributes.name;
                }            
            }
        }

        return formatted_array;
    }

    ChapterService.prototype.clear = async manga_id => {
        this.isLoading = false;
        this.pageEnd = false;
        this.results = [];
        this.offset = 0;
    }

    ChapterService.prototype.getObject = () => {
        return {
            isLoading: this.isLoading,
            pageEnd: this.pageEnd,
            results: this.results,
        }
    }

    ChapterService.prototype.addState = state => {
        this.states.push(state)
    }

    ChapterService.prototype.removeState = state => {
        const index = this.states.indexOf(state);
        if (index > -1) {
            this.states.splice(index, 1);
        }
    }

    ChapterService.prototype.notify = () => {
        for (let i = 0; i < this.states.length; i++) {
            this.states[i]({...this.getObject()})
        }
    }
}

export default new ChapterService();