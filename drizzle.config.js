// will help in db and schema 

export default {

    dialect: "postgresql",
    schema: "./utils/db/schema.ts",
    out: "./drizzle",

    dbCredentials: {
      url: process.env.NEXT_DATABASE_URL,
      connectionString: process.env.NEXT_DATABASE_URL,
    },

  };
  