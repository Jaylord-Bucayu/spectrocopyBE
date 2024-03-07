import { Request, Response } from "express";
import Results from "../models/results";

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
    var arrayOfStrings: string[] = data.channels.split(',');

// Convert each string element into a number
var arrayOfNumbers: number[] = arrayOfStrings.map(function(str:string) {
    return parseInt(str, 10); // Use parseInt to convert string to number
});

    const sections = new Results();
    sections.variety = data.variety;
    sections.channels = arrayOfNumbers;
    sections.price = data.price;
    
    //@ts-ignore
    sections.actual_moisture = calculateRoundedAverage(arrayOfNumbers);
    await sections.save();

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


export async function editResult(req: Request, res: Response) {
    const params = req.params;
    const body = req.body;

    try {
        const updatedResult = await Results.findByIdAndUpdate(params.id, body, { new: true });
        if (!updatedResult) {
            return res.status(404).send({ message: "Result not found" });
        }
        res.status(200).send({ message: "Result edited successfully", result: updatedResult });
    } catch (error) {
        console.error("Error editing result:", error);
        res.status(500).send({ message: "Internal server error" });
    }
}

