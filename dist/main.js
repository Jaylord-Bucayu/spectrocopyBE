"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const results_routes_1 = require("./routes/results.routes");
const results_controller_1 = require("./controllers/results.controller");
const app = (0, express_1.default)();
const mongoose_1 = __importDefault(require("./config/mongoose"));
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
(0, mongoose_1.default)();
(0, results_routes_1.ResultsRoute)(app);
app.use('/models', express_1.default.static('models'));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
function calculateRoundedAverage(numbers) {
    if (numbers.length === 0) {
        return 0;
    }
    const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const average = sum / numbers.length;
    const roundedAverage = Math.round(average * 100) / 100;
    return (roundedAverage / 100).toFixed(2);
}
const firebaseConfig = {
    apiKey: "AIzaSyCk1xhv79A2oXw3KRZUP445KFcG5pbztO8",
    authDomain: "spectroscopy-13d95.firebaseapp.com",
    databaseURL: "https://spectroscopy-13d95-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "spectroscopy-13d95",
    storageBucket: "spectroscopy-13d95.appspot.com",
    messagingSenderId: "884626191341",
    appId: "1:884626191341:web:9fce01f357cc8c20572de4"
};
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert("./firebase.json"),
    databaseURL: firebaseConfig.databaseURL
});
const ref = firebase_admin_1.default.database().ref('Output');
ref.on('value', (snapshot) => {
    if (snapshot.val().flags == 2) {
        MakePrediction();
    }
    return 0;
});
async function MakePrediction() {
    try {
        const ref = firebase_admin_1.default.database().ref('Results');
        const snapshot = await ref.once('value');
        const datas = snapshot.val();
        const data = [datas["A"], datas["B"], datas["C"], datas["D"], datas["E"], datas["F"]];
        const roundedAverage = calculateRoundedAverage(data);
        await firebase_admin_1.default.database().ref('Output').set({
            Prediction: roundedAverage,
            flags: 3
        });
        await (0, results_controller_1.createResultManual)({ channels: data, actual_moisture: roundedAverage });
        return "Data processed successfully.";
    }
    catch (error) {
        console.error('Error processing data:', error);
        return 'Internal Server Error';
    }
}
app.get('/', async (_, res) => {
    res.send(MakePrediction());
});
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=main.js.map