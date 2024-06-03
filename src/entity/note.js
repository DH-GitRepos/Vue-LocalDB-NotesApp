export default class Note {
    constructor(params) {
        this.id = (params && params.id) || null;
        this.title = (params && params.title) || "blank";
        this.content = (params && params.content) || "blank";
        this.category = (params && params.category) || [];
        this.dateCreated = (params && params.dateCreated) || null;
        this.dateUpdated = (params && params.dateUpdated) || null;
    }

    toString()
    {
        return `NOTE ID: ${this.id}, TITLE: ${this.title}, CATEGORY: ${this.category}, CONTENT: ${this.content}, DATE CREATED: ${this.dateCreated}, DATE UPDATED: ${this.dateUpdated}`;
    }

}