// import express from "express";
// import { Response,Request } from "express";
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import admin from 'firebase-admin'; // Import firebase-admin
// import tf from '@tensorflow/tfjs';
// import fs from 'fs';
// import path from 'path';
// const filePath = path.join(__dirname, 'config', 'model.json');


// import { authRoutes } from "./routes/auth.routes"
// import { PaymentsRoute } from './routes/payments.routes'
// import { UsersRoute } from "./routes/user.routes";
// import { SectionRoute } from "./routes/section.routes";
// import { FeesRoute } from "./routes/fees.routes";


// import initializeMongoose from './config/mongoose';

// const firebaseConfig = {
//   apiKey: "AIzaSyCk1xhv79A2oXw3KRZUP445KFcG5pbztO8",
//   authDomain: "spectroscopy-13d95.firebaseapp.com",
//   databaseURL: "https://spectroscopy-13d95-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "spectroscopy-13d95",
//   storageBucket: "spectroscopy-13d95.appspot.com",
//   messagingSenderId: "884626191341",
//   appId: "1:884626191341:web:9fce01f357cc8c20572de4"
// };


// const app = express();
// const port = 5000;


// // Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert("./firebase.json"),// Use default credentials or provide service account key
//   databaseURL: firebaseConfig.databaseURL // Add your databaseURL
// });


// // let loadedModel;
// // async function loadModel() {
// //   console.log(URL + "/model.json");
// //   loadedModel = await tf.loadLayersModel(${URL}/model.json);
// // }



// // Enable CORS
// app.use(cors());
// app.use(bodyParser.json());

// initializeMongoose();
// authRoutes(app);
// PaymentsRoute(app);
// UsersRoute(app);
// SectionRoute(app);
// FeesRoute(app);






// async function createRiceGrainPredict(){
//   return await tf.loadLayersModel('http://localhost:5000/model.json');
// }

// let loadedModel:any;

// async function loadModel() {
 
//   loadedModel = await tf.loadLayersModel('http://localhost:5000/model.json');
// }



// app.get('/model.json', (_:Request, res:Response) => {
//   fs.readFile(filePath, (err, data) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       res.setHeader('Content-Type', 'application/json');
//       res.send(data);
//     }
//   });
// });

// const ref = admin.database().ref('Results'); // Replace 'your_database_node' with your actual database node
 
// ref.on('value', (snapshot) => {
//   const datas = snapshot.val();
//   // console.log(datas);
// }, (error) => {
//   console.error("Error fetching data:", error);
// });

// app.get('/results',  (_, res) => {
//   const ref = admin.database().ref('Results'); // Replace 'your_database_node' with your actual database node
 
//   ref.once('value', (snapshot) => {
//     const datas = snapshot.val();

//     //createRiceGrainPredict();

//     const data = [
//                   {
//                     channels:
//                             [
//                             datas["A"],
//                             datas["B"],
//                             datas["C"],
//                             datas["D"],
//                             datas["E"],
//                             datas["F"]
//                           ],
//                           actual_moisture:[69]
//                 },
               
//                ]
    

//     res.status(200).send(data);

//   }, (errorObject) => {
//     res.status(500).json({ error: 'Failed to fetch data', message: errorObject.message });
//   });
// });


// app.get('/value', async (req, res) => {

//   await createPrediction(req)

//   const ref = admin.database().ref('Value'); // Replace 'your_database_node' with your actual database node
 
//   ref.once('value', (snapshot) => {
//     const data = snapshot.val();
//     res.status(200).json(data);
//   }, (errorObject) => {
//     res.status(500).json({ error: 'Failed to fetch data', message: errorObject.message });
//   });
// });

// // app.listen(port, () => {
// //   runModel().catch(console.error);
// //   console.log(`Server is listening on port ${port}`);
// // });








// import * as tf from '@tensorflow/tfjs-node';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
import { Response,Request } from "express";
const app = express();


app.use(cors());
app.use(bodyParser.json());

// Serve the models directory statically
app.use('/models', express.static('models'));


// // Load the TensorFlow.js model
// async function loadModel() {
//     const model = await tf.loadLayersModel('http://localhost:3000/models/model_final.json');
//     return model;
// }

// // Make predictions using the loaded model
// async function predictUsingModel(model: tf.LayersModel, inputData: number[]) {
//     const inputTensor = tf.tensor2d([inputData], [1, inputData.length]);
//     const prediction = model.predict(inputTensor) as tf.Tensor;
//     const outputData = await prediction.data();
//     return outputData;
// }


// app.get('/', async (_: Request, res: Response) => {
    
//     const model = await loadModel();
//     const inputData = [
//         604.15533, 593.81348, 2035.80823, 1013.91528, 1700.24658, 2139.50391
//     ]; // Example input data
//     const predictions = await predictUsingModel(model, inputData)

//     res.send(predictions)
// })

// Example usage
// (async () => {
//     const model = await loadModel();
//     const inputData = [
//         700, 400, 1100, 500, 800, 1200
//     ]; // Example input data
//     const predictions = await predictUsingModel(model, inputData);
//     console.log('Predictions:', predictions);
// })();

import admin from 'firebase-admin'; // Import firebase-admin


// Function to calculate the average of an array of numbers and round it up
function calculateRoundedAverage(numbers:any) {
    if (numbers.length === 0) {
        return 0; // return 0 for an empty array
    }

    // Calculate the sum of all numbers in the array
    const sum = numbers.reduce((accumulator:any, currentValue:any) => accumulator + currentValue, 0);

    // Calculate the average by dividing the sum by the number of elements
    const average = sum / numbers.length;

    // Round the average to 2 decimal points
    const roundedAverage = Math.round(average * 100) / 100;

    return (roundedAverage / 100).toFixed(2);
}




// Make predictions
// async function predict(model:any, data:any) {
//     const flattenedData = data.flat();
    
//     const inputTensor = tf.tensor2d(flattenedData, [1, flattenedData.length]);
//     const prediction = await model.predict(inputTensor).data();
//     return prediction[0];
// }

// Sample new data
//const newData = [[672.89612,400.28125,2142.95605,	993.57434	,1719.03394	,1722.81909]];


const firebaseConfig = {
  apiKey: "AIzaSyCk1xhv79A2oXw3KRZUP445KFcG5pbztO8",
  authDomain: "spectroscopy-13d95.firebaseapp.com",
  databaseURL: "https://spectroscopy-13d95-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "spectroscopy-13d95",
  storageBucket: "spectroscopy-13d95.appspot.com",
  messagingSenderId: "884626191341",
  appId: "1:884626191341:web:9fce01f357cc8c20572de4"
};




// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert("./firebase.json"),// Use default credentials or provide service account key
  databaseURL: firebaseConfig.databaseURL // Add your databaseURL
});


app.get('/results',  (_, res) => {
  const ref = admin.database().ref('Results'); // Replace 'your_database_node' with your actual database node
  const value = admin.database().ref('Value');
  let moisture: { moisture_level: string } = { moisture_level: '' };

  value.once('value', (snapshot) => {

     moisture = snapshot.val();

    return;

  })
  
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
                          actual_moisture: moisture?.moisture_level
                },
               
               ]

    res.status(200).send(data);

  }, (errorObject) => {
    res.status(500).json({ error: 'Failed to fetch data', message: errorObject.message });
  });
});

app.get('/', async (_: Request, res: Response) => {
    try {
        const ref = admin.database().ref('Results');

        ref.once('value', (snapshot) => {
            const datas = snapshot.val();

            const data = [datas["A"], datas["B"], datas["C"], datas["D"], datas["E"], datas["F"]];

            // Calculate the rounded average
            const roundedAverage = calculateRoundedAverage(data);

            // Log the rounded average
         

            // Set the moisture_level value in the database
            admin.database().ref('Value').set({ moisture_level: roundedAverage });
        });

        return res.send("Data processed successfully.");
    } catch (error) {
        console.error('Error processing data:', error);
        return res.status(500).send('Internal Server Error');
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


