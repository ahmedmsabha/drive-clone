import "server-only";

import { db } from "~/server/db";
import {
  files_table as filesSchema,
  folders_table as foldersSchema,
} from "~/server/db/schema";
import { eq, isNull, and } from "drizzle-orm";

export const QUERIES = {
  getFolders: function (folderId: number) {
    const result = db
      .select()
      .from(foldersSchema)
      .where(eq(foldersSchema.parent, folderId))
      .orderBy(foldersSchema.id);
    return result;
  },
  getFiles: function (folderId: number) {
    const result = db
      .select()
      .from(filesSchema)
      .where(eq(filesSchema.parent, folderId))
      .orderBy(filesSchema.id);
    return result;
  },
  // This function, getAllParentsForFolder, is designed to retrieve all parent folders
  // for a given folder ID, effectively tracing the folder's hierarchy up to the root.
  // It is an asynchronous function that takes a folderId as its parameter.

  // An empty array, 'parents', is initialized to store the parent folders.
  // A Set named 'visited' is used to keep track of folder IDs that have been processed,
  // which helps in detecting circular references in the folder hierarchy.

  // The variable 'currentId' is initialized with the provided folderId and is used
  // to traverse up the folder hierarchy.

  // The function enters a while loop that continues as long as 'currentId' is not null.
  // Inside the loop, it first checks if 'currentId' has already been visited.
  // If it has, this indicates a circular reference, and an error is thrown.

  // If 'currentId' is not visited, it is added to the 'visited' set.
  // The function then queries the database to fetch the folder with the current ID.
  // It uses a limit of 1 to ensure only one record is fetched.

  // If no folder is found for the current ID, an error is thrown indicating the folder
  // was not found.

  // If a folder is found, it is added to the beginning of the 'parents' array.
  // The 'currentId' is then updated to the parent ID of the current folder,
  // effectively moving up one level in the hierarchy.

  // Once the loop completes, the 'parents' array, which now contains all parent folders
  // in order from the root to the immediate parent of the given folder, is returned.
  getAllParentsForFolder: async function (folderId: number) {
    const parents = [];
    const visited = new Set<number>(); // To detect circular references
    let currentId: number | null = folderId;

    while (currentId !== null) {
      if (visited.has(currentId)) {
        throw new Error("Circular reference detected in folder hierarchy");
      }
      visited.add(currentId);

      const folder = await db
        .select()
        .from(foldersSchema)
        .where(eq(foldersSchema.id, currentId))
        .limit(1); // Ensure only one record is fetched

      if (!folder[0]) {
        throw new Error(`Folder with id ${currentId} not found`);
      }

      parents.unshift(folder[0]);
      currentId = folder[0].parent;
    }

    return parents;
  },

  getFolderById: async function (folderId: number) {
    const folder = await db
      .select()
      .from(foldersSchema)
      .where(eq(foldersSchema.id, folderId));
    return folder[0];
  },

  getRootFolderForUser: async function (userId: string) {
    const folder = await db
      .select()
      .from(foldersSchema)
      .where(
        and(eq(foldersSchema.ownerId, userId), isNull(foldersSchema.parent)),
      );
    return folder[0];
  },
};

export const MUTATIONS = {
  createFile: async function (input: {
    file: {
      name: string;
      size: number;
      url: string;
      parent: number;
    };
    userId: string;
  }) {
    return await db.insert(filesSchema).values({
      ...input.file,
      ownerId: input.userId,
    });
  },

  onboardUser: async function (userId: string) {
    const rootFolder = await db
      .insert(foldersSchema)
      .values({
        name: "Root",
        parent: null,
        ownerId: userId,
      })
      .returning({
        id: foldersSchema.id,
      });

    const rootFolderId = rootFolder[0]!.id;

    await db.insert(foldersSchema).values([
      {
        name: "Trash",
        parent: rootFolderId,
        ownerId: userId,
      },
      {
        name: "Shared",
        parent: rootFolderId,
        ownerId: userId,
      },
      {
        name: "Documents",
        parent: rootFolderId,
        ownerId: userId,
      },
    ]);

    return rootFolderId;
  },
};
