import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const MyQuillEditor = () => {
  const quillRef = useRef(null);

  useEffect(() => {
    const quill = new Quill(quillRef.current, {
      theme: "snow",
    });

    quill.on("text-change", function () {
      console.log(quill.root.innerHTML);
    });

    return () => {
      quill.root.innerHTML = "";
    };
  }, []);

  return <div ref={quillRef}></div>;
};

export default MyQuillEditor;
