"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorToolbar } from "./EditorToolbar";
import { twMerge } from "tailwind-merge";

interface EditorProps {
    content?: string;
    onChange?: (html: string) => void;
    placeholder?: string;
    onImageUpload?: (file: File) => Promise<string>;
    className?: string;
    editable?: boolean;
}

export const Editor = ({
    content = "",
    onChange,
    placeholder = "내용을 입력하세요...",
    onImageUpload,
    className,
    editable = true,
}: EditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-primary-main underline cursor-pointer",
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: "rounded-lg max-w-full h-auto my-4",
                },
            }),
            TextAlign.configure({
                types: ["heading", "paragraph", "image"],
            }),
            Placeholder.configure({
                placeholder,
                emptyEditorClass:
                    "before:content-[attr(data-placeholder)] before:text-text-disabled before:float-left before:pointer-events-none h-full",
            }),
        ],
        content,
        editable,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: twMerge(
                    [
                        "prose",
                        "prose-sm",
                        "sm:prose-base",
                        "max-w-none",
                        "focus:outline-none",
                        "min-h-60",
                        "p-6",
                        " rounded-b-md",
                    ],
                    !editable && "bg-transparent border-none p-0",
                    className,
                ),
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange?.(html === "<p></p>" ? "" : html);
        },
    });

    return (
        <div className="w-full rounded-md border border-divider-main overflow-hidden">
            {editable && <EditorToolbar editor={editor} onImageUpload={onImageUpload} />}
            <EditorContent editor={editor} />
        </div>
    );
};
