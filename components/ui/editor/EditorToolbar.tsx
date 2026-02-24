"use client";

import { type Editor } from "@tiptap/react";
import {
    RiBold,
    RiItalic,
    RiStrikethrough,
    RiUnderline,
    RiLink,
    RiImageAddLine,
    RiListUnordered,
    RiListOrdered,
    RiAlignLeft,
    RiAlignCenter,
    RiAlignRight,
    RiH1,
    RiH2,
    RiH3,
    RiParagraph,
} from "react-icons/ri";
import { ChangeEvent, useRef } from "react";
import { twMerge } from "tailwind-merge";

interface EditorToolbarProps {
    editor: Editor | null;
    onImageUpload?: (file: File) => Promise<string>;
}

export const EditorToolbar = ({ editor, onImageUpload }: EditorToolbarProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!editor) {
        return null;
    }

    const buttonClass = (isActive: boolean = false) =>
        twMerge(
            "p-2 rounded-md text-text-secondary hover:bg-background-paper hover:text-text-primary transition-colors",
            isActive && "bg-primary-main/10 text-primary-main font-bold"
        );

    const setLink = () => {
        const previousUrl = editor.getAttributes("link").href;
        // TODO: 나중에 예쁜 모달로 교체 가능. 지금은 간단히 prompt 사용
        const url = window.prompt("URL을 입력해주세요", previousUrl);

        if (url === null) return;
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    };

    const handleImageButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onImageUpload) {
            try {
                const url = await onImageUpload(file);
                editor.chain().focus().setImage({ src: url }).run();
            } catch (error) {
                console.error("Image upload failed:", error);
                alert("이미지 업로드에 실패했습니다.");
            } finally {
                e.target.value = "";
            }
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 bg-background-default border-b border-divider-main rounded-t-md">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            <button
                type={"button"}
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={buttonClass(editor.isActive("bold"))}
                title="굵게">
                <RiBold className="w-5 h-5" />
            </button>
            <button
                type={"button"}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={buttonClass(editor.isActive("italic"))}
                title="기울임">
                <RiItalic className="w-5 h-5" />
            </button>
            <button
                type={"button"}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={buttonClass(editor.isActive("underline"))}
                title="밑줄">
                <RiUnderline className="w-5 h-5" />
            </button>
            <button
                type={"button"}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={buttonClass(editor.isActive("strike"))}
                title="취소선">
                <RiStrikethrough className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-divider-main mx-2" />

            <button
                type={"button"}
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={buttonClass(editor.isActive("paragraph"))}
                title="본문">
                <RiParagraph className="w-5 h-5" />
            </button>
            <button
                type={"button"}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={buttonClass(editor.isActive("heading", { level: 1 }))}
                title="제목 1 (가장 크게)">
                <RiH1 className="w-5 h-5" />
            </button>
            <button
                type={"button"}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={buttonClass(editor.isActive("heading", { level: 2 }))}
                title="제목 2 (중간)">
                <RiH2 className="w-5 h-5" />
            </button>
            <button
                type={"button"}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={buttonClass(editor.isActive("heading", { level: 3 }))}
                title="제목 3 (작게)">
                <RiH3 className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-divider-main mx-2" />

            <button
                type={"button"}
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                className={buttonClass(editor.isActive({ textAlign: "left" }))}
                title="왼쪽 정렬">
                <RiAlignLeft className="w-5 h-5" />
            </button>
            <button
                type={"button"}
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                className={buttonClass(editor.isActive({ textAlign: "center" }))}
                title="가운데 정렬">
                <RiAlignCenter className="w-5 h-5" />
            </button>
            <button
                type={"button"}
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                className={buttonClass(editor.isActive({ textAlign: "right" }))}
                title="오른쪽 정렬">
                <RiAlignRight className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-divider-main mx-2" />

            <button
                type={"button"}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={buttonClass(editor.isActive("bulletList"))}
                title="글머리 기호 목록">
                <RiListUnordered className="w-5 h-5" />
            </button>
            <button
                type={"button"}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={buttonClass(editor.isActive("orderedList"))}
                title="번호 매기기 목록">
                <RiListOrdered className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-divider-main mx-2" />

            <button
                type={"button"}
                onClick={setLink}
                className={buttonClass(editor.isActive("link"))}
                title="링크 삽입">
                <RiLink className="w-5 h-5" />
            </button>

            {onImageUpload && (
                <button
                    type={"button"}
                    onClick={handleImageButtonClick}
                    className={buttonClass()}
                    title="이미지 삽입">
                    <RiImageAddLine className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};