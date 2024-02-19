"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const auth_routes_1 = require("./routes/auth.routes");
const payments_routes_1 = require("./routes/payments.routes");
const user_routes_1 = require("./routes/user.routes");
const section_routes_1 = require("./routes/section.routes");
const fees_routes_1 = require("./routes/fees.routes");
const mongoose_1 = __importDefault(require("./config/mongoose"));
const firebaseConfig = {
    apiKey: "AIzaSyCk1xhv79A2oXw3KRZUP445KFcG5pbztO8",
    authDomain: "spectroscopy-13d95.firebaseapp.com",
    databaseURL: "https://spectroscopy-13d95-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "spectroscopy-13d95",
    storageBucket: "spectroscopy-13d95.appspot.com",
    messagingSenderId: "884626191341",
    appId: "1:884626191341:web:9fce01f357cc8c20572de4"
};
const app = (0, express_1.default)();
const port = 5000;
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert("./firebase.json"),
    databaseURL: firebaseConfig.databaseURL
});
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
(0, mongoose_1.default)();
(0, auth_routes_1.authRoutes)(app);
(0, payments_routes_1.PaymentsRoute)(app);
(0, user_routes_1.UsersRoute)(app);
(0, section_routes_1.SectionRoute)(app);
(0, fees_routes_1.FeesRoute)(app);
app.get('/results', (_, res) => {
    const ref = firebase_admin_1.default.database().ref('Results');
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
                actual_moisture: [69]
            },
        ];
        res.status(200).send(data);
    }, (errorObject) => {
        res.status(500).json({ error: 'Failed to fetch data', message: errorObject.message });
    });
});
app.get('/value', (_, res) => {
    const ref = firebase_admin_1.default.database().ref('Value');
    ref.once('value', (snapshot) => {
        const data = snapshot.val();
        res.status(200).json(data);
    }, (errorObject) => {
        res.status(500).json({ error: 'Failed to fetch data', message: errorObject.message });
    });
});
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
//# sourceMappingURL=main.js.map