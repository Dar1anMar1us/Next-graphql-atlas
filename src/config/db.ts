import mongoose from "mongoose";

export const connectDb = async () => {
    if (process.env.DB_URI) {
        const connection = await mongoose.connect(process.env.DB_URI)
        console.log("MongoDB connected!", connection.connection.host)
    }
}