import User from "../models/User";
import Task from "../models/Task";
import bcrypt from "bcrypt";

export const resolvers = {
  Query: {
    users: async () => await User.findAll(),
    user: async (_: any, { id }: { id: string }) => await User.findByPk(id),
    tasks: async (_:any,__:any, {req }: any) => (await Task.findAll({where: {userId: req.session.userId}})),
    task: async (_: any, { id }: { id: string }) => await Task.findByPk(id),
    loggedInUser: async (_: any, __: any, { req }: any) => {
      if (!req.session.userId) return null;
      return await User.findByPk(req.session.userId);
    },
  },

  Mutation: {
    createUser: async (_: any, { name, email, password }: { name: string; email: string; password: string }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      return await User.create({ name, email, password: hashedPassword });
    },

    login: async (_: any, { email, password }: { email: string; password: string }, { req }: any) => {
      const user = await User.findOne({ where: { email } });
      if (!user) throw new Error("Invalid email or password");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid email or password");

      req.session.userId = user.id;
      return user;
    },

    logout: async (_: any, __: any, { req, res }: any) => {
      return new Promise((resolve) => {
        req.session.destroy((err: any) => {
          if (err) {
            console.error(err);
            resolve(false);
          }
          res.clearCookie("connect.sid"); // Clear session cookie
          resolve(true);
        });
      });
    },

    createTask: async (_: any, { title, description, status }: { title: string; description?: string; status: string }, { req, res }: any) => {
      if (!req.session.userId) throw new Error("Authentication required");
      return await Task.create({ title, description, status, userId: req.session.userId });
    },

    updateTask: async (_: any, { id, title, description, status }: { id: string; title?: string; description?: string; status?: string }, { req, res }: any) => {
      if (!req.session.userId) throw new Error("Authentication required");

      const task = await Task.findByPk(id);
      if (!task) throw new Error("Task not found");

      if (task.userId !== req.session.userId) throw new Error("Unauthorized");

      return await task.update({ title, description, status });
    },

    deleteTask: async (_: any, { id }: { id: string }, { req, res }: any) => {
      if (!req.session.userId) throw new Error("Authentication required");

      const task = await Task.findByPk(id);
      if (!task) throw new Error("Task not found");

      if (task.userId !== req.session.userId) throw new Error("Unauthorized");

      await task.destroy();
      return true;
    },
  },

  User: {
    tasks: async (user: any) => await Task.findAll({ where: { userId: user.id } }),
  },

  Task: {
    user: async (task: any) => await User.findByPk(task.userId),
  },
};
