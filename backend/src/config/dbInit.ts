import sequelize from "./database";

// ensuring models are registered with Sequelize
import "../models/User";
import "../models/Task";

// function to connect and sync database
export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    // model synchronization
    await sequelize.sync({ alter: true });
    console.log("Models synchronized.");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // exit if DB fails
  }
};
