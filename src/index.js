import httpStatus from "http-status";
import { Prediction } from "../models/prediction.model";
import ApiError from "../utilities/api-error";
import { database } from "../config/firebase";
import { push, ref, serverTimestamp, set } from "firebase/database";

const tf = require("@tensorflow/tfjs");

/**
 * Create a prediction
 * @param {Object} predictionBody
 * @returns {Promise<Prediction>}
 */

const URL =
  process.env.NODE_ENV === "production"
    ? "https://chillease-backend.onrender.com/tf-models/models"
    : "http://localhost:8000/tf-models/models";
let loadedModel;
async function loadModel() {
  console.log(URL + "/model.json");
  loadedModel = await tf.loadLayersModel(${URL}/model.json);
}

const createPrediction = async (req) => {
  console.log("test", req);
  try {
    await loadModel();

    const newDataPoint = await tf.tensor2d([req.array]);

    //red

    // const newDataPoint = await tf.tensor2d([
    //   [
    //     0.3631477472862058, 0.372151732035388, 0.21351169652663213,
    //     0.16948921670533873, 0.1574983152572284, 0.36458592870833184,
    //     0.16936675675614818, 0.2592517140407553, 0.19952178492358896,
    //     0.24968063149294523, 0.20373010551226078, 0.1878846148199089,
    //     0.22819690038375268, 0.19987766101580695, 0.3519073913728593,
    //     0.2741969831044767, 0.15285010826183304, 0.17078370989390565,
    //   ],
    // ]);

    console.log("datapoint", newDataPoint);

    // Make predictions using the loaded model
    const predictions = loadedModel.predict(newDataPoint);
    console.log("predicts0", predictions);
    const probabilities = predictions.arraySync()[0];

    console.log("predicts1", probabilities);

    const color_mapping = { 0: "Red", 1: "Green", 2: "Blue" };

    // Convert predicted probabilities to percentages
    const probabilities_percentage = probabilities.map((probability, index) => {
      return ${color_mapping[index]}-${probability * 100}%;
    });

    // Join probabilities_percentage into a single string
    const result_string = probabilities_percentage.join(" ");

    console.log("Predicted Probabilities:", result_string);

    const predictionss = probabilities.map((probability, index) => {
      return {
        class: color_mapping[index],
        score: probability,
      };
    });

    const formattedString = `${predictionss
      .map((entry) => ${entry.class}: ${entry.score * 100}%)
      .join(", ")}`;

    const chilleaseRef = ref(database, /Output);

    await set(chilleaseRef, {
      Prediction: formattedString,
      flags: 3,
    });

    const createdPrediction = await Prediction.create({
      ...req,
      probabilities: predictionss,
    });

    return createdPrediction;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
};


   
//     const model = await loadModel2();

//     const prediction = await predict(model, newData);
//    console.log({prediction})
   
    // Example array of numbers

// [604.15533, 593.81348, 2035.80823, 1013.91528, 1700.24658, 2139.50391];