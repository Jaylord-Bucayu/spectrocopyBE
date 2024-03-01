"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const prediction_model_1 = require("../models/prediction.model");
const api_error_1 = __importDefault(require("../utilities/api-error"));
const firebase_1 = require("../config/firebase");
const database_1 = require("firebase/database");
const tf = require("@tensorflow/tfjs");
const URL = process.env.NODE_ENV === "production"
    ? "https://chillease-backend.onrender.com/tf-models/models"
    : "http://localhost:8000/tf-models/models";
let loadedModel;
async function loadModel() {
    console.log(URL + "/model.json");
    loadedModel = await tf.loadLayersModel($, { URL } / model.json);
}
const createPrediction = async (req) => {
    console.log("test", req);
    try {
        await loadModel();
        const newDataPoint = await tf.tensor2d([req.array]);
        console.log("datapoint", newDataPoint);
        const predictions = loadedModel.predict(newDataPoint);
        console.log("predicts0", predictions);
        const probabilities = predictions.arraySync()[0];
        console.log("predicts1", probabilities);
        const color_mapping = { 0: "Red", 1: "Green", 2: "Blue" };
        const probabilities_percentage = probabilities.map((probability, index) => {
            return $;
            {
                color_mapping[index];
            }
            -$;
            {
                probability * 100;
            }
             % ;
        });
        const result_string = probabilities_percentage.join(" ");
        console.log("Predicted Probabilities:", result_string);
        const predictionss = probabilities.map((probability, index) => {
            return {
                class: color_mapping[index],
                score: probability,
            };
        });
        const formattedString = `${predictionss
            .map((entry) => $, { entry, : .class }, $, { entry, : .score * 100 } % )
            .join(", ")}`;
        const chilleaseRef = (0, database_1.ref)(firebase_1.database, /Output);, await (0, database_1.set)(chilleaseRef, {
            Prediction: formattedString,
            flags: 3,
        }));
        const createdPrediction = await prediction_model_1.Prediction.create(Object.assign(Object.assign({}, req), { probabilities: predictionss }));
        return createdPrediction;
    }
    catch (error) {
        throw new api_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Something went wrong");
    }
};
//# sourceMappingURL=index.js.map