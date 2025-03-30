import mongoose from "mongoose";

const connectToDatabase = async () => {
  const CONNECTION_STRING = process.env.DATABASE_URI;

  try {
    console.log("[Mongoose] Connecting to database...");
    if (!CONNECTION_STRING) {
      throw new Error(
        "Connection string not defined in environment variables file"
      );
    } else {
      mongoose.connection.on("connected", () => {
        console.log("[Mongoose] Database connected");
      });
      mongoose.connection.on("error", (err) => {
        console.error(`[Mongoose] Error: ${err.message}`);
      });

      await mongoose.connect(CONNECTION_STRING, {
        dbName: "member",
      });
    }
  } catch (err) {
    console.error(err);
  }
};

export default connectToDatabase;
