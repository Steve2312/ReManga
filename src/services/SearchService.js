import { createRequest, findIDByType } from './RequestService';

const limit = 50;

function SearchService() {
    
    this.states = [];
    this.title = "";

    this.isLoading = false;
    this.results = [];
    this.pageEnd = false;

    this.offset = 0;

    this.timeout = null;
    
    SearchService.prototype.search = title => {
        this.isLoading = true;
        this.notify();

        clearTimeout(this.timeout);
        this.timeout = setTimeout(async () => {
            const response = await createRequest("/manga", {
                title: title,
                offset: 0,
                limit: limit,
                order: title ? { relevance : 'desc'} : { followedCount : 'desc'}
            })
    
            const data = await this.resolve_ids(this.format(response));
    
            this.results = data;
            this.pageEnd = data < limit;
            this.offset = this.results.length;
            this.title = title;
    
            this.isLoading = false;
            this.notify();
        }, 500);
    }

    SearchService.prototype.loadMore = async () => {
        if (!this.pageEnd && !this.isLoading) {
            this.isLoading = true;
            this.notify();

            const response = await createRequest("/manga", {
                title: this.title,
                offset: this.offset,
                limit: limit,
                order: this.title ? { relevance : 'desc'} : { followedCount : 'desc'}
            })

            const data = await this.resolve_ids(this.format(response));

            this.results = [...this.results, ...data];
            this.pageEnd = data < limit;
            this.offset = this.results.length;

            this.isLoading = false;
            this.notify();
        }
    }

    SearchService.prototype.addState = state => {
        this.states.push(state)
    }

    SearchService.prototype.removeState = state => {
        const index = this.states.indexOf(state);
        if (index > -1) {
            this.states.splice(index, 1);
        }
    }

    SearchService.prototype.notify = () => {
        for (let i = 0; i < this.states.length; i++) {
            this.states[i]({...this.getObject()})
        }
    }

    SearchService.prototype.getObject = () => {
        return {
            isLoading: this.isLoading,
            results: this.results,
            pageEnd: this.pageEnd
        }
    }

    SearchService.prototype.format = (array) => {
        const temp = [];

        for (let i = 0; i < array.length; i++) {
            const item = array[i];
    
            const {id, type, attributes, relationships} = item;
    
            const title = attributes.title.en || Object.values(attributes.title)[0];
            const description = attributes.description.en || Object.values(attributes.description)[0];
            const genres = attributes.tags.map(tag => tag.attributes.group == 'genre' ? tag.attributes.name.en : null).filter(i => i != null).join(', ');
    
            const cover_id = findIDByType(relationships, "cover_art");
            const author_id = findIDByType(relationships, "author");
            const artist_id = findIDByType(relationships, "artist");
    
            const data = {
                id: id,
                type: type,
                title: title,
                description: description,
                status: attributes.status,
                updatedAt: attributes.updatedAt,
                genres: genres,
            }
    
            if (cover_id) {
                data = {...data, cover: {id: cover_id}};
            }
    
            if (author_id) {
                data = {...data, author: {id: author_id}};
            }
    
            if (artist_id) {
                data = {...data, artist: {id: artist_id}};
            }
    
            temp.push(data);
        }
    
        return temp;
    }

    SearchService.prototype.resolve_ids = async (formatted_array) => {
        const cover_ids = [];
        const author_ids = [];
        const artist_ids = [];

        for (let i = 0; i < formatted_array.length; i++) {
            const item = formatted_array[i];

            if (item.cover) {
                cover_ids.push(item.cover.id);
            }

            if (item.author) {
                author_ids.push(item.author.id);
            }

            if (item.artist) {
                artist_ids.push(item.artist.id);
            }
        }

        const coverResponse = await createRequest('/cover', {
            limit: limit,
            ids: cover_ids,
        });

        for (let i = 0; i < coverResponse.length; i++) {
            const cover = coverResponse[i];
            for (let y = 0; y < formatted_array.length; y++) {
                const item = formatted_array[y];
                if (item["cover"] && cover.id == item["cover"]["id"]) {
                    formatted_array[y]["cover"]["fileName"] = cover.attributes.fileName;
                    break;
                }            
            }
        }

        const authorResponse = await createRequest('/author', {
            limit: limit,
            ids: author_ids,
        });

        for (let i = 0; i < authorResponse.length; i++) {
            const author = authorResponse[i];
            for (let y = 0; y < formatted_array.length; y++) {
                const item = formatted_array[y];
                if (item["author"] && author.id == item["author"]["id"]) {
                    formatted_array[y]["author"]["name"] = author.attributes.name;
                }            
            }
        }

        const artistResponse = await createRequest('/author', {
            limit: limit,
            ids: artist_ids,
        });

        for (let i = 0; i < artistResponse.length; i++) {
            const artist = artistResponse[i];
            for (let y = 0; y < formatted_array.length; y++) {
                const item = formatted_array[y];
                if (item["artist"] && artist.id == item["artist"]["id"]) {
                    formatted_array[y]["artist"]["name"] = artist.attributes.name;
                }            
            }
        }

        return formatted_array;
    }
}

export default new SearchService();