import React from "react";
import {
  HtmlEditor,
  Image,
  Inject,
  Link,
  QuickToolbar,
  RichTextEditorComponent,
  Toolbar,
} from "@syncfusion/ej2-react-richtexteditor";

const RichTextEditor = () => {
  return (
    <div className="App">
      <RichTextEditorComponent>
        <p>
          The Rich Text Editor component editor that provides the best user
          experience to create and update the content. Users can format their
          content using standard toolbar commands.
        </p>
        <Inject services={[Toolbar, Image, Link, HtmlEditor, QuickToolbar]} />
      </RichTextEditorComponent>
    </div>
  );
};

export default RichTextEditor;
