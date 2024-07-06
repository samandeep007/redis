import { createClient } from "redis";
const client = createClient();

const processSubmission = async(submission: string) => {
    const{problemId, code, language} = JSON.parse(submission);
    console.log(`Processing submission for problemId ${problemId}...`);
    console.log(`Code: ${code}`);
    console.log(`language: ${language}`)


    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Finished processing submission for problemId ${problemId}.`);

}

const startWorker = async() => {
    try {
        await client.connect();
        console.log("Worker connected to Redis");
    } catch (error) {
        console.error;
    }

     while(true){
         try {
            const submission = await client.brPop("problems", 0);
            await processSubmission(submission.element); //submission is an array with the key and the value, we only need the value
         } catch (error) {
            console.error("Error processing the submission", error)
         }
     }
  
}

startWorker();