"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
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
app.get('/results', (_, res) => {
    const ref = firebase_admin_1.default.database().ref('Results');
    const value = firebase_admin_1.default.database().ref('Value');
    let moisture = { moisture_level: '' };
    value.once('value', (snapshot) => {
        moisture = snapshot.val();
        return;
    });
    ref.once('value', (snapshot) => {
        const datas = snapshot.val();
        const data = [
            {
                channels: [
                    datas["A"],
                    datas["B"],
                    datas["C"],
                    datas["D"],
                    datas["E"],
                    datas["F"]
                ],
                actual_moisture: moisture === null || moisture === void 0 ? void 0 : moisture.moisture_level
            },
        ];
        res.status(200).send(data);
    }, (errorObject) => {
        res.status(500).json({ error: 'Failed to fetch data', message: errorObject.message });
    });
});
app.get('/', async (_, res) => {
    try {
        const ref = firebase_admin_1.default.database().ref('Results');
        ref.once('value', (snapshot) => {
            const datas = snapshot.val();
            const data = [datas["A"], datas["B"], datas["C"], datas["D"], datas["E"], datas["F"]];
            const roundedAverage = calculateRoundedAverage(data);
            firebase_admin_1.default.database().ref('Value').set({ moisture_level: roundedAverage });
        });
        return res.send("Data processed successfully.");
    }
    catch (error) {
        console.error('Error processing data:', error);
        return res.status(500).send('Internal Server Error');
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=main.js.map