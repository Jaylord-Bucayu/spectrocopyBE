import { Application } from "express";

import { getResultById, createResult, getAllResult,deleteResult } from "../controllers/results.controller";

export function ResultsRoute(app: Application) {

     /**
    * payments list
    **/

    app.get('/results',
    getAllResult);
    
    app.get("/results/:id",
    getResultById
    )

    app.post("/results/create", createResult)


    app.delete("/results/delete/:id", deleteResult)
}
