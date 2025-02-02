import {
  integer,
  text,
  index,
  pgTableCreator,
  bigint,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `drive_clone_${name}`);

export const files_table = createTable(
  "files_table",
  {
    id: bigint("id", { mode: "number" }).primaryKey().notNull(),
    ownerId: text("owner_id").notNull(),
    name: text("name").notNull(),
    size: integer("size").notNull(),
    url: text("url").notNull(),
    parent: bigint("parent", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    parentIdx: index("parent_index").on(t.parent),
    ownerIdx: index("owner_id_index").on(t.ownerId),
  }),
);

export type DB_FileType = typeof files_table.$inferSelect;

export const folders_table = createTable(
  "folders_table",
  {
    id: bigint("id", { mode: "number" }).primaryKey().notNull(),
    ownerId: text("owner_id").notNull(),
    name: text("name").notNull(),
    parent: bigint("parent", { mode: "number" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    parentIdx: index("parent_index").on(t.parent),
    ownerIdx: index("owner_id_index").on(t.ownerId),
  }),
);
