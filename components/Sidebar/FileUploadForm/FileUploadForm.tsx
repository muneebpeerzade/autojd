"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { parseResumeFromPdf } from "@/lib/parse-resume-from-pdf";
import { Resume } from "@/lib/parse-resume-from-pdf/resumeTypes";

export default function FileUploadForm({
  onResumeSave,
}: {
  onResumeSave: (values: Resume | null) => void;
}) {
  const [files, setFiles] = React.useState<File[]>([]);

  const onFileValidate = React.useCallback(
    (file: File): string | null => {
      // Validate max files
      if (files.length >= 1) {
        return "You can only upload up to 1 file";
      }

      // Validate file type (only PDF)
      if (file.type !== "application/pdf") {
        return "Only PDF files are allowed";
      }

      // Validate file size (max 2MB)
      const MAX_SIZE = 2 * 1024 * 1024; // 2MB
      if (file.size > MAX_SIZE) {
        return `File size must be less than ${MAX_SIZE / (1024 * 1024)}MB`;
      }
      return null;
    },
    [files]
  );

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" has been rejected`,
    });
  }, []);

  useEffect(() => {
    const processPdf = async () => {
      if (files.length === 1) {
        try {
          const fileUrl = URL.createObjectURL(files[0]);
          const items = await parseResumeFromPdf(fileUrl);
          if (Object.entries(items).length !== 0) {
            onResumeSave(items);
          }
        } catch (err) {
          console.log(err)
          toast("Failed to parse PDF");
        }
      } else if (files.length === 0) {
        console.log("empty");
        onResumeSave(null);
      }
    };
    processPdf();
  }, [files]);
  return (
    <FileUpload
      value={files}
      onValueChange={setFiles}
      onFileValidate={onFileValidate}
      onFileReject={onFileReject}
      accept="application/pdf"
      maxFiles={1}
      className="w-full max-w-md"
    >
      {files.length === 0 && (
        <FileUploadDropzone>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center justify-center rounded-full border p-2.5">
              <Upload className="size-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-sm">Drop Your Resume here</p>
            <p className="text-muted-foreground text-xs">Or click to browse</p>
          </div>
          <FileUploadTrigger asChild>
            <Button variant="outline" size="sm" className="mt-2 w-fit">
              Browse files
            </Button>
          </FileUploadTrigger>
        </FileUploadDropzone>
      )}
      {files.length > 0 && (
        <FileUploadList>
          <p className="font-medium text-sm">Your Resume</p>
          {files.map((file) => (
            <FileUploadItem key={file.name} value={file}>
              <FileUploadItemPreview />
              <FileUploadItemMetadata />
              <FileUploadItemDelete asChild>
                <Button variant="ghost" size="icon" className="size-7">
                  <X />
                </Button>
              </FileUploadItemDelete>
            </FileUploadItem>
          ))}
        </FileUploadList>
      )}
    </FileUpload>
  );
}
