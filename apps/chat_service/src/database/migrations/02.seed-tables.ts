import { SequelizeDatabase } from "../sequelize/sequelize-database.js";

const client = new SequelizeDatabase();
await client.connect();
await client.createModels();
await client.userModel?.model?.create({ username: 'Nico', password: 'rocket' });
await client.userModel?.model?.create({ username: 'Chris', password: 'pass' });
await client.conversationModel?.model?.create({ title: 'Les chats', user_id: 1 });
await client.conversationModel?.model?.create({ title: 'Les Avengers', user_id: 2 });

await client.close();
