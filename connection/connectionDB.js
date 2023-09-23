import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);
async function connection(){
    try {
        await client.connect();
        console.log("Conexion Exitosa");
    } catch (error) {
        console.log(error);
    }
};

export { connection, client }