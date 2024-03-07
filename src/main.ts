
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
import { Response,Request } from "express";

//routes
import { ResultsRoute}  from './routes/results.routes';
import  {createResultManual} from './controllers/results.controller';
const app = express();
import initializeMongoose from './config/mongoose';

app.use(cors());
app.use(bodyParser.json());

initializeMongoose();
ResultsRoute(app);

// Serve the models directory statically
app.use('/models', express.static('models'));


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


// app.get('/results',  (_: Request, res: Response) => {
//   const ref = admin.database().ref('Results'); // Replace 'your_database_node' with your actual database node
//   const value = admin.database().ref('Output');
//   let moisture: { Prediction: number } = { Prediction: 0 };

//   value.once('value', (snapshot) => {

//      moisture = snapshot.val().Prediction;

//     return;

//   })
  
//   ref.once('value', (snapshot:any) => {
//     const datas = snapshot.val();

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
//                           actual_moisture: moisture
//                 },
               
//                ]

              

//     res.status(200).send(data);

//   }, (errorObject:any) => {
//     res.status(500).json({ error: 'Failed to fetch data', message: errorObject.message });
//   });
// });

const ref = admin.database().ref('Output');

ref.on('value', (snapshot) => {

  // console.log(snapshot.val())

  if(snapshot.val().flags == 2 ){
   
   MakePrediction();
  }
 return 0;
})


async function MakePrediction() {
  try {
    const ref = admin.database().ref('Results');

    const snapshot = await ref.once('value');
    const datas = snapshot.val();

    const data = [datas["A"], datas["B"], datas["C"], datas["D"], datas["E"], datas["F"]];

    // Calculate the rounded average
    const roundedAverage = calculateRoundedAverage(data);

    // Log the rounded average
    // console.log({ roundedAverage });

    // Set the moisture_level value in the database
    await admin.database().ref('Output').set({ 
      Prediction: roundedAverage,
      flags: 3
    });

    await createResultManual({ channels: data, actual_moisture: roundedAverage });

    return "Data processed successfully.";
  } 
  catch (error) {
    console.error('Error processing data:', error);
    return 'Internal Server Error';
  }
}



app.get('/ping', async (_: Request, res: Response) => {
 
 console.log("pinged")
  res.send("server is server")
});



// import cron from 'cron';
import axios from 'axios';



const CronJob = require("cron").CronJob;

//9:00 am
const job = new CronJob("*/13 * * * *", () => {

  console.log('Request successful');

  axios.get('https://spectrocopybe-8t7k.onrender.com/ping')
        .then((_:any) => {
            console.log('Request successful');

            return;
        })
        .catch((error:any) => {
            console.error('Error making request:', error.message);
        });
});

// // Define a cron job to run every 14 minutes
// const job = new cron.CronJob('*/1 * * * *', function() {
//     // Call your request here using Axios or any HTTP client

//     console.log("sads")
//     // axios.get('http://localhost:5000/ping')
//     //     .then((_:any) => {
//     //         console.log('Request successful');

//     //         return;
//     //     })
//     //     .catch((error:any) => {
//     //         console.error('Error making request:', error.message);
//     //     });
// });

// Start the cron job
job.start();


const PORT = 5000;
app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}`);
});


