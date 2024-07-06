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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const app = (0, express_1.default)();
app.use(express_1.default.json()); // for parsing application/json
const client = (0, redis_1.createClient)();
client.on('error', (error) => console.log('Redis client Error', error));
app.post('/submit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { problemId, code, language } = req.body;
    // store the code in redis
    try {
        yield client.lPush("problems", JSON.stringify({
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
    }
    catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: "Error submitting code"
        });
    }
}));
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log('Redis connected successfully');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    }
    catch (error) {
        console.error('Error starting server', error);
    }
});
startServer();
