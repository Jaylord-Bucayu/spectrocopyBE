import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import admin from 'firebase-admin'; // Import firebase-admin
import tf from '@tensorflow/tfjs';

import { authRoutes } from "./routes/auth.routes"
import { PaymentsRoute } from './routes/payments.routes'
import { UsersRoute } from "./routes/user.routes";
import { SectionRoute } from "./routes/section.routes";
import { FeesRoute } from "./routes/fees.routes";


import initializeMongoose from './config/mongoose';

const firebaseConfig = {
  apiKey: "AIzaSyCk1xhv79A2oXw3KRZUP445KFcG5pbztO8",
  authDomain: "spectroscopy-13d95.firebaseapp.com",
  databaseURL: "https://spectroscopy-13d95-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "spectroscopy-13d95",
  storageBucket: "spectroscopy-13d95.appspot.com",
  messagingSenderId: "884626191341",
  appId: "1:884626191341:web:9fce01f357cc8c20572de4"
};


const app = express();
const port = 5000;


// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert("./firebase.json"),// Use default credentials or provide service account key
  databaseURL: firebaseConfig.databaseURL // Add your databaseURL
});


// let loadedModel;
// async function loadModel() {
//   console.log(URL + "/model.json");
//   loadedModel = await tf.loadLayersModel(${URL}/model.json);
// }



// Enable CORS
app.use(cors());
app.use(bodyParser.json());

initializeMongoose();
authRoutes(app);
PaymentsRoute(app);
UsersRoute(app);
SectionRoute(app);
FeesRoute(app);

app.get('/results', (_, res) => {
  const ref = admin.database().ref('Results'); // Replace 'your_database_node' with your actual database node
 
  ref.once('value', (snapshot) => {
    const datas = snapshot.val();

    const data = [
                  {
                    channels:
                            [
                            datas["A"],
                            datas["B"],
                            datas["C"],
                            datas["D"],
                            datas["E"],
                            datas["F"]
                          ],
                          actual_moisture:[69]
                },
               
               ]
    

    res.status(200).send(data);

  }, (errorObject) => {
    res.status(500).json({ error: 'Failed to fetch data', message: errorObject.message });
  });
});


app.get('/value', (_, res) => {
  const ref = admin.database().ref('Value'); // Replace 'your_database_node' with your actual database node
 
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
