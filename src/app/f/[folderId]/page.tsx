import { db } from "~/server/db";
import DriveContents from "../../drive-content";
import { folders_table } from "~/server/db/schema";
import { files_table } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";
export default async function GoogleDriveClone({
  params,
}: {
  params: Promise<{ folderId: string }>;
}) {
  const { folderId } = await params;
  const parsedFolderId = parseInt(folderId);
  if (isNaN(parsedFolderId)) {
    return <div>Invalid folder ID</div>;
  }

  const files = await db
    .select()
    .from(files_table)
    .where(eq(files_table.parent, parsedFolderId))
    .orderBy(desc(files_table.createdAt));
  const folders = await db
    .select()
    .from(folders_table)
    .where(eq(folders_table.parent, parsedFolderId));
  return <DriveContents files={files} folders={folders} />;
}
