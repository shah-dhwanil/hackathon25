





// RichTextEditor.jsx
import { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  Alignment,
  AutoImage,
  AutoLink,
  Autosave,
  BalloonToolbar,
  BlockQuote,
  BlockToolbar,
  Bold,
  Bookmark,
  CloudServices,
  CodeBlock,
  Essentials,
  GeneralHtmlSupport,
  Heading,
  HorizontalLine,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  ListProperties,
  Mention,
  Paragraph,
  Style,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TodoList,
  Underline,
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

const LICENSE_KEY = 'GPL';

export default function RichTextEditor({ data = '', isReadOnly = true, onChange }) {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);

  const { editorConfig } = useMemo(() => {
    if (!isLayoutReady) return {};

    return {
      editorConfig: {
        toolbar: {
          items: !isReadOnly
            ? [
              'undo', 'redo', '|',
              'heading', 'style', '|',
              'bold', 'italic', 'underline', '|',
              'horizontalLine', 'link', 'bookmark',
              'insertImageViaUrl', 'insertTable', 'blockQuote', 'codeBlock', '|',
              'alignment', '|', 'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
            ]
            : [],
          shouldNotGroupWhenFull: false,
        },
        plugins: [
          Alignment, AutoImage, AutoLink, Autosave, BalloonToolbar, BlockQuote, BlockToolbar,
          Bold, Bookmark, CloudServices, CodeBlock, Essentials, GeneralHtmlSupport, Heading,
          HorizontalLine, ImageBlock, ImageCaption, ImageInline, ImageInsertViaUrl, ImageResize,
          ImageStyle, ImageTextAlternative, ImageToolbar, ImageUpload, Indent, IndentBlock, Italic,
          Link, List, ListProperties, Mention, Paragraph, Style, Table, TableCaption, TableCellProperties,
          TableColumnResize, TableProperties, TableToolbar, TodoList, Underline
        ],
        initialData: data,
        licenseKey: LICENSE_KEY,
        placeholder: 'Type or paste your content here!',
        link: {
          addTargetToExternalLinks: true,
          defaultProtocol: 'https://',
          decorators: {
            toggleDownloadable: {
              mode: 'manual',
              label: 'Downloadable',
              attributes: { download: 'file' },
            },
          },
        },
        list: {
          properties: {
            styles: true,
            startIndex: true,
            reversed: true,
          },
        },
        mention: {
          feeds: [
            {
              marker: '@',
              feed: ['@Barney', '@Lily', '@Ted', '@Robin', '@Marshall'],
            },
          ],
        },
        image: {
          toolbar: [
            'toggleImageCaption', 'imageTextAlternative', '|',
            'imageStyle:inline', 'imageStyle:wrapText', 'imageStyle:breakText', '|', 'resizeImage',
          ],
        },
        table: {
          contentToolbar: [
            'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'
          ],
        },
      },
    };
  }, [isLayoutReady, data]);

  return (
    <div className="main-container">
      <div
        className="editor-container"
        ref={editorContainerRef}
      >
        <div className="editor-container__editor">
          <div ref={editorRef}>
            {editorConfig && (
              <CKEditor
                className="w-full"
                editor={ClassicEditor}
                config={editorConfig}
                data={data}
                disabled={isReadOnly}
                onReady={(editor) => console.log('Editor ready', editor)}
                onChange={(event, editor) => {
                  const newData = editor.getData();
                  if (onChange) onChange(newData);
                }}

              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}





