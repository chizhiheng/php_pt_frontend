import React, {useState} from 'react';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw, ContentState, convertFromHTML } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './Editor.scss';

export default function RichEditor(props) {
    const [editorContent, setEditorContent] = useState(EditorState.createEmpty());
    const {placeholder, stateCallback, content} = props;
    
    // if (content != ''){
    //     setEditorContent(convertFromHTML(content));
    // }
    // const templateContent = `<div></div>`;
    // const blocksFromHtml = convertFromHTML(templateContent);
    // const editorStateContentInitial = ContentState.createFromBlockArray(
    //     blocksFromHtml.contentBlocks,
    //     blocksFromHtml.entityMap,
    //   );

    function uploadImageCallBack(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          const img = new Image();
          // let url = ''
          reader.onload = function(e) {
            img.src = this.result;
          };
      
          img.onload = function() {
            console.log(img); // 获取图片
            console.log(img.src.length)
            // 缩放图片需要的canvas（也可以在DOM中直接定义canvas标签，这样就能把压缩完的图片不转base64也能直接显示出来）
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
      
            // 图片原始尺寸
            const originWidth = this.width;
            const originHeight = this.height;
      
            // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
            const maxWidth = 400;
            const maxHeight = 500;
            // 目标尺寸
            let targetWidth = originWidth;
            let targetHeight = originHeight;
            // 图片尺寸超过300x300的限制
            if (originWidth > maxWidth || originHeight > maxHeight) {
              if (originWidth / originHeight > maxWidth / maxHeight) {
                // 更宽，按照宽度限定尺寸
                targetWidth = maxWidth;
                targetHeight = Math.round(maxWidth * (originHeight / originWidth));
              } else {
                targetHeight = maxHeight;
                targetWidth = Math.round(maxHeight * (originWidth / originHeight));
              }
            }
            // canvas对图片进行缩放
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            // 清除画布
            context.clearRect(0, 0, targetWidth, targetHeight);
            // 图片压缩
            context.drawImage(img, 0, 0, targetWidth, targetHeight);
            /* 第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高 */
      
            // 压缩后的图片转base64 url
            /* canvas.toDataURL(mimeType, qualityArgument),mimeType 默认值是'image/png';
             * qualityArgument表示导出的图片质量，只有导出为jpeg和webp格式的时候此参数才有效，默认值是0.92 */
            const newUrl = canvas.toDataURL('image/jpeg', 0.92); // base64 格式
            resolve({
              data: {
                link: newUrl,
              },
            });
      
            // 也可以把压缩后的图片转blob格式用于上传
            canvas.toBlob((blob)=>{
                console.log(blob)
                //把blob作为参数传给后端
            }, 'image/jpeg', 0.92)
          };
        });
    }

    function onEditorStateChange(editorState) {
        const richEditorContent = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        stateCallback(richEditorContent);
    //     console.log(editorState);
    //     const oldState = editorContent; // 变更前的editorState
    //     const newState = editorState; // 变更后的editorState
    
    //     const oldText = oldState.getCurrentContent().getPlainText();
    //     const newText = newState.getCurrentContent().getPlainText();
    
    //     // if (newText !== oldText) {   // 加判断后居中 列表 不生效，所以注释
          setEditorContent(editorState);
    //    //  }
      }

    return (
        <Editor
            editorState={editorContent}
            editorClassName="rich-editor"
            toolbarClassName="editor-toolbar"
            placeholder={placeholder}
            toolbar={{
                options: [
                    'inline',
                    'blockType',
                    'fontSize',
                    // 'fontFamily',
                    'list',
                    'textAlign',
                    'colorPicker',
                    'link',
                    // 'embedded',
                    'image',
                    // 'remove',
                    'history',
                  ],
                //  link: { inDropdown: true, linkCallback },
                //  embedded: { embedCallback },
                 fontFamily: {
                  options: [
                    '宋体',
                    '黑体',
                    '楷体',
                    '微软雅黑',
                    'Arial',
                    'Georgia',
                    'Impact',
                    'Tahoma',
                    'Times New Roman',
                    'Verdana',
                  ],
                },
                image: {
                  uploadCallback: uploadImageCallBack,

                  uploadEnabled: true,
                  alignmentEnabled: true, // 是否显示排列按钮 相当于text-align

                  previewImage: true,
                  inputAccept: 'image/*',
                  alt: { present: false, mandatory: false },
                  defaultSize: {
                    height: 'auto',
                    width: 'auto',
                  },
                },
              }}
              onEditorStateChange={onEditorStateChange}
        />
    );
}