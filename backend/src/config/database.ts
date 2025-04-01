import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

/* const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false, // Disable logging SQL queries
  }
);
 */
const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // for render
    }
  }
});
export default sequelize;
