import {
  integer,
  index,
  pgTable,
  timestamp,
  serial,
  varchar,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const files_table = pgTable(
  "files_table",
  {
    id: serial("id").primaryKey().notNull(),
    ownerId: varchar("owner_id").notNull(),
    name: varchar("name").notNull(),
    size: integer("size").notNull(),
    url: varchar("url").notNull(),
    parent: integer("parent").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("files_parent_index").on(t.parent),
    index("files_owner_id_index").on(t.ownerId),
  ],
);

export type DB_FileType = typeof files_table.$inferSelect;

export const folders_table = pgTable(
  "folders_table",
  {
    id: serial("id").primaryKey().notNull(),
    ownerId: varchar("owner_id").notNull(),
    name: varchar("name").notNull(),
    parent: integer("parent"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("folders_parent_index").on(t.parent),
    index("folders_owner_id_index").on(t.ownerId),
  ],
);

export type DB_FolderType = typeof folders_table.$inferSelect;
