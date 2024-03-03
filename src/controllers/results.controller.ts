import { Request, Response } from "express";
import Results from "../models/results";

export async function getResultById(req: Request, res: Response) {

    const data = req.params.id;

  
    const sections = await Results.findById(data);

    res.send(sections)

}

export async function getAllResult(req: Request, res: Response) {

    const data = req.body;
    const sections = await Results.find(data);

    res.send(sections)

}

export async function createResult(req: Request, res: Response) {

    const data = req.body;
    const sections = new Results(data);

    res.send(sections)

}

export async function createResultManual(body: Record<string, any>) : Promise<any> {
    try {
        // Create a new instance of Results model with the provided data
        const sections = new Results(body);

        // Save the new document to the database
        const savedResult = await sections.save();

        console.log(savedResult); // Output the saved document for verification

        return savedResult; // Return the saved document
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error creating result:', error);
        throw error; // Re-throw the error for the caller to handle
    }

  
}

export async function deleteResult(req: Request, res: Response) {
    const params = req.params

    await Results.findByIdAndDelete(params.id);

    res.send({
        message:"deleted"
    })
        
}