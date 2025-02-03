import { db } from "~/server/db";
import DriveContents from "../../drive-content";
import { folders_table } from "~/server/db/schema";
import { files_table } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";

async function getAllParents(folderId: number) {
  const parents = [];
  let currentId: number | null = folderId;
  while (currentId !== null) {
    const folder = await db
      .selectDistinct()
      .from(folders_table)
      .where(eq(folders_table.id, currentId));

    if (!folder[0]) {
      throw new Error("Parent folder not found");
    }

    parents.unshift(folder[0]);
    currentId = folder[0]?.parent ?? null;
  }
  return parents;
}
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

  const filesPromise = db
    .select()
    .from(files_table)
    .where(eq(files_table.parent, parsedFolderId))
    .orderBy(desc(files_table.createdAt));
  const foldersPromise = db
    .select()
    .from(folders_table)
    .where(eq(folders_table.parent, parsedFolderId));

  const parentsPromise = getAllParents(parsedFolderId);

  const [files, folders, parents] = await Promise.all([
    filesPromise,
    foldersPromise,
    parentsPromise,
  ]);
  return <DriveContents files={files} folders={folders} parents={parents} />;
}
