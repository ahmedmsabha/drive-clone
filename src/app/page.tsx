import { db } from "~/server/db";
import DriveContents from "./drive-content";
import { folders_table } from "~/server/db/schema";
import { files_table } from "~/server/db/schema";

export default async function GoogleDriveClone() {
  const files = await db.select().from(files_table);
  const folders = await db.select().from(folders_table);
  return <DriveContents files={files} folders={folders} />;
}
