import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useRef, useEffect } from 'react';
const modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{list: 'ordered'}, {list: 'bullet'}],
        ['link'],
        [{align: []}],
        ['clean']
    ]
};
// @ts-ignore
const AutoGrowingEditor = ({id, value, onChange}) => {
    const editorRef = useRef<ReactQuill | null>(null);

    useEffect(() => {
        const editor = editorRef.current?.getEditor().root;

        if (editor) {
            editor.style.overflow = 'hidden';
            const resizeEditor = () => {
                editor.style.height = 'auto';
                editor.style.height = editor.scrollHeight + 'px';
            };

            resizeEditor();

            const observer = new MutationObserver(resizeEditor);
            observer.observe(editor, {
                childList: true,
                subtree: true,
                characterData: true,
            });

            return () => observer.disconnect();
        }
    }, [value]);

    return (
        <ReactQuill
            id={id}
            ref={editorRef}
            value={value}
            onChange={onChange}
            modules={modules}
            style={{minHeight: '100px'}}
        />
    );
};

export default AutoGrowingEditor;
