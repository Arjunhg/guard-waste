// postgresql://neondb_owner:ZAzKQW1M7wnY@ep-lively-surf-a1jb4cgb.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from './schema';

const sql = neon(process.env.NEXT_DATABASE_URL)

export const db = drizzle(sql, { schema }); //this db object will help with database interaction