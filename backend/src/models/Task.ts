import { DataTypes, Model, UUIDV4 } from "sequelize";
import sequelize from "../config/database";
import User from "./User";

class Task extends Model {
  public id!: string;
  public title!: string;
  public description!: string;
  public status!: "pending" | "in-progress" | "completed";
  public userId!: number;
}

Task.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "in-progress", "completed"),
      allowNull: false,
      defaultValue: "pending",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "tasks",
    timestamps: true,
  }
);

// Define Relationship
User.hasMany(Task, { foreignKey: "userId" });
Task.belongsTo(User, { foreignKey: "userId" });

export default Task;
