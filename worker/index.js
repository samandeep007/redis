"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const client = (0, redis_1.createClient)();
const processSubmission = (submission) => __awaiter(void 0, void 0, void 0, function* () {
    const { problemId, code, language } = JSON.parse(submission);
    console.log(`Processing submission for problemId ${problemId}...`);
    console.log(`Code: ${code}`);
    console.log(`language: ${language}`);
    yield new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Finished processing submission for problemId ${problemId}.`);
});
const startWorker = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log("Worker connected to Redis");
    }
    catch (error) {
        console.error;
    }
    while (true) {
        try {
            const submission = yield client.brPop("problems", 0);
            yield processSubmission(submission.element); //submission is an array with the key and the value, we only need the value
        }
        catch (error) {
            console.error("Error processing the submission", error);
        }
    }
});
startWorker();
