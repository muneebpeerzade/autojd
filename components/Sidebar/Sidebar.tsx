import React from "react";
import Toolbar from "@/components/Sidebar/Toolbar";
import {} from "@/components/ui/file-upload";
import FileUploadForm from "./FileUploadForm/FileUploadForm";
const Sidebar = () => {
  return (
    <div className="border rounded p-2">
      <FileUploadForm/>
      <Toolbar />
    </div>
  );
};

export default Sidebar;
