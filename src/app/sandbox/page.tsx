import { db } from "~/server/db";
import { mockFolders } from "~/lib/mock-data";
import { folders_table } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";

export default function Sandbox() {
  return (
    <div className="flex flex-col gap-4">
      Seed Function
      <form
        action={async () => {
          "use server";
          const user = await auth();
          if (!user.userId) {
            throw new Error("User not found");
          }
          const rootFolder = await db
            .insert(folders_table)
            .values({
              name: "root",
              ownerId: user.userId,
              parent: null,
            })
            .returning({
              id: folders_table.id,
            });

          const folderInsert = await db.insert(folders_table).values(
            mockFolders.map((folder) => ({
              name: folder.name,
              ownerId: user.userId,
              parent: rootFolder[0]!.id,
            })),
          );

          console.log(folderInsert);
        }}
      >
        <button type="submit">Seed</button>
      </form>
    </div>
  );
}
