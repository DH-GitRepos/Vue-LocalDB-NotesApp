import Category from '@/entity/category.js';

export class CategoryGateway {
    
    constructor(params) {
        this.db = (params && params.db) || null;
        }

    test(){
        alert("Successfully accessed CATEGORY gateway.");
    }
    
    toString(){
        return "Successfully accessed CATEGORY gateway.";
    }

    createCategory(title, description) {

    }

    readCategory(title) {

    }

    readAllCategories() {

    }

    updateCategory(title) {

    }

    deleteCategory(title) {

    }

}