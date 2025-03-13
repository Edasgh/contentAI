"use server";
import { generateVideoSummary } from "./titleGeneration";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-001",
  systemInstruction:
    "You are a helpful youtube video creator assistant that creates QUESTION SUGGESTIONS for the given video summary.",

});

const chat = model.startChat({});


export async function generateQuestionSuggestions(videoId:string){

   try {
     //getting the video summary
     const {summary:videoSummary} = await generateVideoSummary(videoId);
     if (!videoSummary) {
       return {
         error: "Failed to generate questions (system error) ",
       };
     }
     //getting suggestions
     const result = await chat.sendMessage(
       `Given the following video summary, generate ONLY 5 engaging and insightful questions to encourage discussion and deeper understanding. 
      Provide a mix of:
      - Factual questions (based on information in the summary)
      - Interpretative questions (require deeper thought)
      - Opinion-based questions (encourage debate)
      - Predictive questions (about future implications)
      - Application-based questions (relate to real-world examples)
      
      Video Summary:
      "${videoSummary}"

      Generate the questions ONLY and nothing else. Don't include numerical or alphabetical order in questions
    `
     );

     const questions = result.response.text();

     if (!questions) {
       return {
         error: "Failed to generate questions (system error) ",
       };
     }

     const generatedQs = (questions.split("\n")).filter((e)=>e!=="");

     return {
       questions: generatedQs,
     };
   } catch (error) {
    console.log("Error fetching questions : ",error);
    return{
        questions:[],
        error:"Error occurred while fetching questions, try again"
    }
   }






}