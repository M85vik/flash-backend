import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error("MONGO_URI environment variable is not set.");
}

export const connectToDatabase = async () => {
  try {
    const connectionResponse = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB is Connected :", connectionResponse.connection.host);
  } catch (error) {
    console.log("MongoDB is not connected, ERROR: ", error.message);
     process.exit(1); // Exit with a failure code
  }
};
