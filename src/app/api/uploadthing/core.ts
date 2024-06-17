import { createUploadthing } from 'uploadthing/next';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } }).onUploadComplete(
    async ({ metadata, file }) => {
      return { url: file.url };
    }
  ),
  fileUploader: f({
    blob: { maxFileSize: '2GB' },
  }).onUploadComplete(async ({ metadata, file }) => {
    return { url: file.url };
  }),
};

export type OurFileRouter = typeof ourFileRouter;
