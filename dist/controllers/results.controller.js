"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editResult = exports.deleteResult = exports.createResultManual = exports.createResult = exports.getAllResult = exports.getResultById = void 0;
const results_1 = __importDefault(require("../models/results"));
function calculateRoundedAverage(numbers) {
    if (numbers.length === 0) {
        return 0;
    }
    const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const average = sum / numbers.length;
    const roundedAverage = Math.round(average * 100) / 100;
    return (roundedAverage / 100).toFixed(2);
}
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
    var arrayOfStrings = data.channels.split(',');
    var arrayOfNumbers = arrayOfStrings.map(function (str) {
        return parseInt(str, 10);
    });
    const sections = new results_1.default();
    sections.variety = data.variety;
    sections.channels = arrayOfNumbers;
    sections.actual_moisture = calculateRoundedAverage(arrayOfNumbers);
    await sections.save();
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
async function deleteResult(req, res) {
    const params = req.params;
    await results_1.default.findByIdAndDelete(params.id);
    res.send({
        message: "deleted"
    });
}
exports.deleteResult = deleteResult;
async function editResult(req, res) {
    const params = req.params;
    const body = req.body;
    try {
        const updatedResult = await results_1.default.findByIdAndUpdate(params.id, body, { new: true });
        if (!updatedResult) {
            return res.status(404).send({ message: "Result not found" });
        }
        res.status(200).send({ message: "Result edited successfully", result: updatedResult });
    }
    catch (error) {
        console.error("Error editing result:", error);
        res.status(500).send({ message: "Internal server error" });
    }
}
exports.editResult = editResult;
//# sourceMappingURL=results.controller.js.map