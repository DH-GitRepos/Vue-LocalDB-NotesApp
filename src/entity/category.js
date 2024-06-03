export default class Category {
    constructor(params) {
        this.id = (params && params.id) || 0;
        this.name = (params && params.name) || "blank";
        this.description = (params && params.description) || "blank";
    }

    toString()
    {
        return `CATEGORY ID: ${this.id}, NAME: ${this.name}, DESCRIPTION: ${this.description}`;
    }

}