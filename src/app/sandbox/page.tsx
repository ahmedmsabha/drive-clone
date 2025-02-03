import { db } from "~/server/db";
import { mockFiles, mockFolders } from "~/lib/mock-data";
import { folders_table } from "~/server/db/schema";
import { files_table } from "~/server/db/schema";

export default function Sandbox() {
  return (
    <div className="flex flex-col gap-4">
      Seed Function
      <form
        action={async () => {
          "use server";
          const folderInsert = await db.insert(folders_table).values(
            mockFolders.map((folder, index) => ({
              id: index + 1,
              name: folder.name,
              ownerId: "1",
              parent: index === 0 ? 1 : null,
            })),
          );
          const fileInsert = await db.insert(files_table).values(
            mockFiles.map((file, index) => ({
              id: index + 1,
              name: file.name,
              ownerId: "1",
              size: 4096,
              url: file.url,
              parent: (index % 3) + 1,
            })),
          );
          console.log(folderInsert, fileInsert);
        }}
      >
        <button type="submit">Seed</button>
      </form>
    </div>
  );
}
