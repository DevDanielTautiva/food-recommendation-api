"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantSchema = void 0;
var dynamoose = require("dynamoose");
var menusSchema = new dynamoose.Schema({
    name: {
        type: String,
        required: true,
    },
    ingredients: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    qualification: {
        type: String,
        required: true,
    },
});
exports.restaurantSchema = new dynamoose.Schema({
    id: {
        type: String,
        hashKey: true
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    foodType: {
        type: String,
        required: true,
    },
    menus: {
        type: Array,
        schema: [menusSchema],
        default: [],
    },
    referencias: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
