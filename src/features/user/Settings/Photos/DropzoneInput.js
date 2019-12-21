import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone"; //react hook
import { Icon, Header } from "semantic-ui-react";

const DropzoneInput = ({ setFiles }) => {
  const onDrop = useCallback(
    acceptedFiles => {
      //acceptedFiles is one element arrtay
      console.log("acctpd files,", acceptedFiles);
      setFiles(
        acceptedFiles.map(f =>
          Object.assign(f, {
            preview: URL.createObjectURL(f)
          })
        )
      );
    },
    [setFiles]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: "image/*"
  });

  return (
    <div
      {...getRootProps()}
      className={"dropzone " + (isDragActive && "dropzone--isActive")}
    >
      <input {...getInputProps()} />
      <Icon name="upload" size="huge" />
      <Header content="Drop Image Here" />
    </div>
  );
};

export default DropzoneInput;
