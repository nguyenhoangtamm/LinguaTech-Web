"use client";

import { forwardRef, useEffect, useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { EditorState, ContentState, convertToRaw } from "draft-js";

// Dynamically import Editor to avoid SSR issues
const Editor = dynamic(
    () => import("react-draft-wysiwyg").then((mod) => ({ default: mod.Editor })),
    {
        ssr: false,
        loading: () => <div className="h-32 bg-gray-100 rounded animate-pulse" />
    }
);

// Import Draft.js and WYSIWYG styles
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./rich-text-editor.css";

interface RichTextEditorProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    readOnly?: boolean;
    className?: string;
}

const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
    ({ value, onChange, placeholder, readOnly = false, className }, ref) => {
        const [mounted, setMounted] = useState(false);
        const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
        const isMountedRef = useRef(false);
        const isInitializedRef = useRef(false);
        const editorRef = useRef<any>(null);

        useEffect(() => {
            isMountedRef.current = true;
            setMounted(true);

            return () => {
                isMountedRef.current = false;
            };
        }, []);

        // Convert HTML to Draft.js EditorState when value changes
        useEffect(() => {
            if (!mounted) return;

            if (value) {
                try {
                    // Lazy load on client side only
                    const htmlToDraftModule = require("html-to-draftjs");
                    const htmlToDraft = htmlToDraftModule.default || htmlToDraftModule;
                    const contentBlock = htmlToDraft(value);
                    if (contentBlock && isMountedRef.current) {
                        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                        const newEditorState = EditorState.createWithContent(contentState);

                        // Only update if content actually changed or this is the first initialization
                        const currentContent = editorState.getCurrentContent().getPlainText();
                        const newContent = contentState.getPlainText();

                        if (!isInitializedRef.current || currentContent !== newContent) {
                            setEditorState(newEditorState);
                            isInitializedRef.current = true;
                        }
                    }
                } catch (error) {
                    console.error("Error converting HTML to Draft.js:", error);
                    if (isMountedRef.current && !isInitializedRef.current) {
                        setEditorState(EditorState.createEmpty());
                        isInitializedRef.current = true;
                    }
                }
            } else if (isMountedRef.current && (!isInitializedRef.current || editorState.getCurrentContent().hasText())) {
                setEditorState(EditorState.createEmpty());
                isInitializedRef.current = true;
            }
        }, [value, mounted, editorState]);

        // Handle editor state changes
        const onEditorStateChange = useCallback((newEditorState: EditorState) => {
            if (!isMountedRef.current) return;

            setEditorState(newEditorState);

            // Convert Draft.js content to HTML
            try {
                // Lazy load on client side only
                const draftToHtmlModule = require("draftjs-to-html");
                const draftToHtml = draftToHtmlModule.default || draftToHtmlModule;
                const contentState = newEditorState.getCurrentContent();
                const rawContentState = convertToRaw(contentState);
                const html = draftToHtml(rawContentState);
                onChange?.(html);
            } catch (error) {
                console.error("Error converting Draft.js to HTML:", error);
            }
        }, [onChange]);

        if (!mounted) {
            return <div className="h-32 bg-gray-100 rounded animate-pulse" />;
        }

        const toolbarOptions = {
            options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'link', 'embedded', 'remove', 'history'],
            inline: {
                inDropdown: false,
                options: ['bold', 'italic', 'underline', 'strikethrough'],
            },
            blockType: {
                inDropdown: true,
                options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote'],
            },
            fontSize: {
                options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
            },
            list: {
                inDropdown: false,
                options: ['unordered', 'ordered', 'indent', 'outdent'],
            },
            textAlign: {
                inDropdown: false,
                options: ['left', 'center', 'right', 'justify'],
            },
            link: {
                inDropdown: false,
                showOpenOptionOnHover: true,
                defaultTargetOption: '_self',
            },
        };

        return (
            <div ref={ref} className={className}>
                <div className="draft-editor-container">
                    <Editor
                        ref={editorRef}
                        editorState={editorState}
                        onEditorStateChange={onEditorStateChange}
                        placeholder={placeholder}
                        readOnly={readOnly}
                        toolbar={toolbarOptions}
                        editorClassName="draft-editor-content"
                        toolbarClassName="draft-editor-toolbar"
                        onFocus={() => { }}
                        onBlur={() => { }}
                    />
                </div>
            </div>
        );
    }
);

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;