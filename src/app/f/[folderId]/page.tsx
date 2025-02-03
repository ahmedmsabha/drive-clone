import { db } from "~/server/db";
import DriveContents from "../../drive-content";
import { folders_table } from "~/server/db/schema";
import { files_table } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";
import * as queries from "~/lib/queries";

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

  const filesPromise = queries.QUERIES.getFiles(parsedFolderId);
  const foldersPromise = queries.QUERIES.getFolders(parsedFolderId);

  const parentsPromise = queries.QUERIES.getAllParentsForFolder(parsedFolderId);

  const [files, folders, parents] = await Promise.all([
    filesPromise,
    foldersPromise,
    parentsPromise,
  ]);
  return <DriveContents files={files} folders={folders} parents={parents} />;
}
