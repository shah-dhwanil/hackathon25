import { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useQA } from '../context/QAContext'
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
// import './App.css';
import TagSelector from '../components/TagSelector'
import { useNavigate } from 'react-router-dom';

const LICENSE_KEY = 'GPL';


const AskQuestionPage = () => {
  // const navigate = useNavigate()
  // const { availableTags, addQuestion } = useQA()
  
  // const [title, setTitle] = useState('')
  // const [content, setContent] = useState('')
  // const [tags, setTags] = useState([])
  // const [isSubmitting, setIsSubmitting] = useState(false)

  // const isValid = title.trim().length > 0 && content.trim().length > 0 && tags.length > 0

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   console.log('Submitting question:', { title, content, tags })
  //   if (!isValid) return

  //   setIsSubmitting(true)
    
  //   try {
  //     const questionId = addQuestion({
  //       title: title.trim(),
  //       content,
  //       tags
  //     })
      
  //     navigate(`/question/${questionId}`)
  //   } catch (error) {
  //     console.error('Error creating question:', error)
  //   } finally {
  //     setIsSubmitting(false)
  //   }
  // }

  // return (
  //   <div className="max-w-4xl mx-auto">
  //     <div className="mb-8">
  //       <h1 className="text-3xl font-bold text-gray-900 mb-2">Ask a Question</h1>
  //       <p className="text-gray-600">
  //         Get help from the community by asking a detailed question.
  //       </p>
  //     </div>

  //     <form onSubmit={handleSubmit} className="space-y-6">
  //       <div className="bg-white rounded-lg shadow-sm border p-6">
  //         <div className="space-y-6">
  //           <div>
  //             <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
  //               Question Title *
  //             </label>
  //             <input
  //               type="text"
  //               id="title"
  //               value={title}
  //               onChange={(e) => setTitle(e.target.value)}
  //               placeholder="What's your programming question? Be specific."
  //               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //               maxLength={200}
  //             />
  //             <p className="text-sm text-gray-500 mt-1">
  //               {title.length}/200 characters
  //             </p>
  //           </div>

  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-2">
  //               Tags *
  //             </label>
  //             <TagSelector
  //               availableTags={availableTags}
  //               selectedTags={tags}
  //               onChange={setTags}
  //               placeholder="Select relevant tags..."
  //             />
  //             <p className="text-sm text-gray-500 mt-1">
  //               Add tags to help others find your question
  //             </p>
  //           </div>

  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-2">
  //               Question Details *
  //             </label>
  //             <RichTextEditor
  //               content={content}
  //               onChange={setContent}
  //               placeholder="Provide all the details about your question. Include what you've tried, what you expected to happen, and what actually happened."
  //             />
  //             <p className="text-sm text-gray-500 mt-1">
  //               Use the rich text editor to format your question with code blocks, lists, and more.
  //             </p>
  //           </div>
  //         </div>
  //       </div>

  //       <div className="flex justify-end space-x-4">
  //         <button
  //           type="button"
  //           onClick={() => navigate('/')}
  //           className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
  //         >
  //           Cancel
  //         </button>
          
  //         <button
  //           type="submit"
  //           disabled={!isValid || isSubmitting}
  //           className={`px-6 py-2 rounded-lg transition-colors ${
  //             isValid && !isSubmitting
  //               ? 'bg-blue-600 text-white hover:bg-blue-700'
  //               : 'bg-gray-300 text-gray-500 cursor-not-allowed'
  //           }`}
  //         >
  //           {isSubmitting ? 'Publishing...' : 'Publish Question'}
  //         </button>
  //       </div>
  //     </form>
  //   </div>


  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const { availableTags, addQuestion } = useQA()
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [tags, setTags] = useState([])
   const [title, setTitle] = useState('')
   const navigate=useNavigate();
  

  useEffect(() => {
    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);

  const { editorConfig } = useMemo(() => {
    if (!isLayoutReady) return {};

    return {
      editorConfig: {
        toolbar: {
          items: [
            'undo',
            'redo',
            '|',
            'heading',
            'style',
            '|',
            'bold',
            'italic',
            'underline',
            '|',
            'horizontalLine',
            'link',
            'bookmark',
            'insertImageViaUrl',
            'insertTable',
            'blockQuote',
            'codeBlock',
            '|',
            'alignment',
            '|',
            'bulletedList',
            'numberedList',
            'todoList',
            'outdent',
            'indent',
          ],
          shouldNotGroupWhenFull: false,
        },
        plugins: [
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
        ],
        balloonToolbar: [
          'bold',
          'italic',
          '|',
          'link',
          '|',
          'bulletedList',
          'numberedList',
        ],
        blockToolbar: [
          'bold',
          'italic',
          '|',
          'link',
          'insertTable',
          '|',
          'bulletedList',
          'numberedList',
          'outdent',
          'indent',
        ],
        heading: {
          options: [
            {
              model: 'paragraph',
              title: 'Paragraph',
              class: 'ck-heading_paragraph',
            },
            {
              model: 'heading1',
              view: 'h1',
              title: 'Heading 1',
              class: 'ck-heading_heading1',
            },
            {
              model: 'heading2',
              view: 'h2',
              title: 'Heading 2',
              class: 'ck-heading_heading2',
            },
            {
              model: 'heading3',
              view: 'h3',
              title: 'Heading 3',
              class: 'ck-heading_heading3',
            },
            {
              model: 'heading4',
              view: 'h4',
              title: 'Heading 4',
              class: 'ck-heading_heading4',
            },
            {
              model: 'heading5',
              view: 'h5',
              title: 'Heading 5',
              class: 'ck-heading_heading5',
            },
            {
              model: 'heading6',
              view: 'h6',
              title: 'Heading 6',
              class: 'ck-heading_heading6',
            },
          ],
        },
        htmlSupport: {
          allow: [
            {
              name: /^.*$/,
              styles: true,
              attributes: true,
              classes: true,
            },
          ],
        },
        image: {
          toolbar: [
            'toggleImageCaption',
            'imageTextAlternative',
            '|',
            'imageStyle:inline',
            'imageStyle:wrapText',
            'imageStyle:breakText',
            '|',
            'resizeImage',
          ],
        },
        initialData:
          '<h2>Welcome to CKEditor 5!</h2><p>This is a sample editor. Make changes and check console for log output.</p>',
        licenseKey: LICENSE_KEY,
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
        menuBar: {
          isVisible: true,
        },
        placeholder: 'Type or paste your content here!',
        style: {
          definitions: [
            { name: 'Article category', element: 'h3', classes: ['category'] },
            { name: 'Title', element: 'h2', classes: ['document-title'] },
            { name: 'Subtitle', element: 'h3', classes: ['document-subtitle'] },
            { name: 'Info box', element: 'p', classes: ['info-box'] },
            {
              name: 'CTA Link Primary',
              element: 'a',
              classes: ['button', 'button--green'],
            },
            {
              name: 'CTA Link Secondary',
              element: 'a',
              classes: ['button', 'button--black'],
            },
            { name: 'Marker', element: 'span', classes: ['marker'] },
            { name: 'Spoiler', element: 'span', classes: ['spoiler'] },
          ],
        },
        table: {
          contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells',
            'tableProperties',
            'tableCellProperties',
          ],
        },
      },
    };
  }, [isLayoutReady]);

  return (
    <div className="main-container">
      <div>
      <div className='pb-4'>
        <h1 className='text-2xl font-bold'>Ask Question</h1>
       
        <div className='flex flex-col w-1/3 space-y-3 pt-5 w-full'>
         <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Question Title *
          </label>
          <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your programming question? Be specific."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={200}
              />
              <p className="text-sm text-gray-500 mt-1">
                {title.length}/200 characters
              </p>
        </div>

        <div className='pt-4'>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Tags *
           </label>
           <TagSelector
                availableTags={availableTags}
                selectedTags={tags}
                onChange={setTags}
                placeholder="Select relevant tags..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Add tags to help others find your question
              </p>
            </div>
      </div>

      <div
        className="editor-container editor-container_classic-editor editor-container_include-style editor-container_include-block-toolbar"
        ref={editorContainerRef}
      >
        <div className="editor-container__editor">
          <div ref={editorRef}>
            {editorConfig && (
              <CKEditor
                editor={ClassicEditor}
                config={editorConfig}
                onReady={(editor) => {
                  console.log('✅ Editor is ready to use!', editor);
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  console.log('📝 Editor data changed:', data);
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-7">
           <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            // disabled={!isValid || isSubmitting}
            className={`px-6 py-2 rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700 cursor-pointer
            `}
            onClick={()=>navigate('/')}
          >
            Submit
            {/* {isSubmitting ? 'Publishing...' : 'Publish Question'} */}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AskQuestionPage









// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useQA } from '../context/QAContext'
// import RichTextEditor from '../components/RichTextEditor'
// import TagSelector from '../components/TagSelector'

// const AskQuestionPage = () => {
//   const navigate = useNavigate()
//   const { availableTags, addQuestion } = useQA()
  
//   const [title, setTitle] = useState('')
//   const [content, setContent] = useState('')
//   const [tags, setTags] = useState([])
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const isValid = title.trim().length > 0 && content.trim().length > 0 && tags.length > 0

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     console.log('Submitting question:', { title, content, tags })
//     if (!isValid) return

//     setIsSubmitting(true)
    
//     try {
//       const questionId = addQuestion({
//         title: title.trim(),
//         content,
//         tags
//       })
      
//       navigate(`/question/${questionId}`)
//     } catch (error) {
//       console.error('Error creating question:', error)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Ask a Question</h1>
//         <p className="text-gray-600">
//           Get help from the community by asking a detailed question.
//         </p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="bg-white rounded-lg shadow-sm border p-6">
//           <div className="space-y-6">
//             <div>
//               <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
//                 Question Title *
//               </label>
//               <input
//                 type="text"
//                 id="title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="What's your programming question? Be specific."
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 maxLength={200}
//               />
//               <p className="text-sm text-gray-500 mt-1">
//                 {title.length}/200 characters
//               </p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Tags *
//               </label>
//               <TagSelector
//                 availableTags={availableTags}
//                 selectedTags={tags}
//                 onChange={setTags}
//                 placeholder="Select relevant tags..."
//               />
//               <p className="text-sm text-gray-500 mt-1">
//                 Add tags to help others find your question
//               </p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Question Details *
//               </label>
//               <RichTextEditor
//                 content={content}
//                 onChange={setContent}
//                 placeholder="Provide all the details about your question. Include what you've tried, what you expected to happen, and what actually happened."
//               />
//               <p className="text-sm text-gray-500 mt-1">
//                 Use the rich text editor to format your question with code blocks, lists, and more.
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end space-x-4">
//           <button
//             type="button"
//             onClick={() => navigate('/')}
//             className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//           >
//             Cancel
//           </button>
          
//           <button
//             type="submit"
//             disabled={!isValid || isSubmitting}
//             className={`px-6 py-2 rounded-lg transition-colors ${
//               isValid && !isSubmitting
//                 ? 'bg-blue-600 text-white hover:bg-blue-700'
//                 : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//             }`}
//           >
//             {isSubmitting ? 'Publishing...' : 'Publish Question'}
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default AskQuestionPage