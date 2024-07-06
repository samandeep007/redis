import express from 'express';
import { createClient } from 'redis';

const app = express();
app.use(express.json()); // for parsing application/json

const client = createClient();
client.on('error', (error) => console.log('Redis client Error', error) );

app.post('/submit', async (req, res)=>{
   const {problemId, code, language} = req.body;

   // store the code in redis
  try {
     await client.lPush("problems", JSON.stringify({
      problemId: problemId,
      code: code,
      language: language
     })); 
     //client.lPush expects a string as the second argument, so we need to convert the object to a string using JSON.stringify
     // first argument is the key, second argument is the value
     res.json({
        success: true,
        message: "Code submitted successfully"
     });
 
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        message: "Error submitting code"
      });
  }
});

  const startServer = async() => {
    try {
      
        await client.connect();
    console.log('Redis connected successfully');
      
      app.listen(3000, () => {
        console.log('Server is running on port 3000');
      
    });
    } catch (error) {
      console.error('Error starting server', error);
    }
  }

startServer();