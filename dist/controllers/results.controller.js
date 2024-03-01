"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResultManual = exports.createResult = exports.getAllResult = exports.getResultById = void 0;
const results_1 = __importDefault(require("../models/results"));
async function getResultById(req, res) {
    const data = req.params.id;
    const sections = await results_1.default.findById(data);
    res.send(sections);
}
exports.getResultById = getResultById;
async function getAllResult(req, res) {
    const data = req.body;
    const sections = await results_1.default.find(data);
    res.send(sections);
}
exports.getAllResult = getAllResult;
async function createResult(req, res) {
    const data = req.body;
    const sections = new results_1.default(data);
    res.send(sections);
}
exports.createResult = createResult;
async function createResultManual(body) {
    try {
        const sections = new results_1.default(body);
        const savedResult = await sections.save();
        console.log(savedResult);
        return savedResult;
    }
    catch (error) {
        console.error('Error creating result:', error);
        throw error;
    }
}
exports.createResultManual = createResultManual;
//# sourceMappingURL=results.controller.js.map