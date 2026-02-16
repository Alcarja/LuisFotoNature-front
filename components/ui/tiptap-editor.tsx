"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import imageCompression from "browser-image-compression";
import { uploadImage } from "@/app/services/imageUpload";
import { toast } from "sonner";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  RotateCcw,
  RotateCw,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Copy,
  Trash2,
} from "lucide-react";

interface TipTapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  postId?: number;
}

export function TipTapEditor({
  value,
  onChange,
  placeholder = "Write your content...",
  className,
  postId,
}: TipTapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const imageWidthInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: { languageClassPrefix: "language-" },
      }),
      Image.extend({
        parseHTML() {
          return [
            {
              tag: "img",
              getAttrs: (element) => {
                // Skip gallery images - let them be rendered as raw HTML
                if (element.classList.contains("gallery-image")) {
                  return false;
                }
                return {};
              },
            },
          ];
        },
      }).configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Subscript,
      Superscript,
      Color.configure({
        types: ["textStyle"],
      }),
      TextStyle,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-zinc max-w-none focus:outline-none min-h-[300px] p-4",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (const file of Array.from(files)) {
        try {
          // Compress image before uploading
          const options = {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          };
          const compressedFile = await imageCompression(file, options);

          // Upload to S3 using presigned URL
          const imageUrl = await uploadImage(compressedFile, "post-body", postId);

          // Insert S3 URL into editor
          editor.chain().focus().setImage({ src: imageUrl }).run();
          toast.success("Image uploaded successfully");
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Image upload failed";
          toast.error(errorMessage);
          console.error("Image upload error:", error);
        }
      }
    }
    // Reset input so same file can be uploaded again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const insertImageWithSize = (width: string) => {
    const url = linkInputRef.current?.value || "";
    if (url) {
      editor
        .chain()
        .focus()
        .setImage({
          src: url,
          alt: "Image",
          title: "Image",
        })
        .run();
      // Set width using HTML style
      editor
        .chain()
        .focus()
        .updateAttributes("image", {
          style: `width: ${width}; height: auto; display: inline-block;`,
        })
        .run();
      if (linkInputRef.current) {
        linkInputRef.current.value = "";
      }
    }
  };

  const handleAddLink = () => {
    const url = linkInputRef.current?.value || "";
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
      if (linkInputRef.current) {
        linkInputRef.current.value = "";
      }
    }
  };

  const createImageContainer = (columns: number) => {
    const colClass =
      columns === 2
        ? "grid-cols-2"
        : columns === 3
          ? "grid-cols-3"
          : "grid-cols-1";
    const html = `<div class="image-gallery-container grid ${colClass} gap-4 my-6 p-4 border-2 border-dashed border-zinc-300 rounded-lg bg-zinc-50 min-h-25 flex items-center justify-center">
      <p class="col-span-full text-sm text-zinc-500 text-center">📷 Gallery container ready. Upload or paste images here</p>
    </div>`;
    editor.chain().focus().insertContent(html).run();
  };

  return (
    <div
      className={cn("border border-zinc-200 rounded-lg bg-white", className)}
    >
      {/* Toolbar */}
      <div className="border-b border-zinc-200 p-3 flex flex-wrap gap-1 bg-zinc-50">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r border-zinc-300 pr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            icon={<Bold size={16} />}
            title="Bold"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            icon={<Italic size={16} />}
            title="Italic"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            icon={<Strikethrough size={16} />}
            title="Strikethrough"
          />
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r border-zinc-300 pr-2">
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive("heading", { level: 1 })}
            icon={<Heading1 size={16} />}
            title="Heading 1"
          />
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive("heading", { level: 2 })}
            icon={<Heading2 size={16} />}
            title="Heading 2"
          />
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive("heading", { level: 3 })}
            icon={<Heading3 size={16} />}
            title="Heading 3"
          />
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            isActive={editor.isActive("heading", { level: 4 })}
            icon={<Heading4 size={16} />}
            title="Heading 4"
          />
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 5 }).run()
            }
            isActive={editor.isActive("heading", { level: 5 })}
            icon={<Heading5 size={16} />}
            title="Heading 5"
          />
        </div>

        {/* Blocks */}
        <div className="flex gap-1 border-r border-zinc-300 pr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive("codeBlock")}
            icon={<Code size={16} />}
            title="Code Block"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            icon={<Quote size={16} />}
            title="Blockquote"
          />
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r border-zinc-300 pr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            icon={<List size={16} />}
            title="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            icon={<ListOrdered size={16} />}
            title="Numbered List"
          />
        </div>

        {/* Alignment */}
        <div className="flex gap-1 border-r border-zinc-300 pr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            icon={<AlignLeft size={16} />}
            title="Align Left"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            icon={<AlignCenter size={16} />}
            title="Align Center"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            icon={<AlignRight size={16} />}
            title="Align Right"
          />
        </div>

        {/* Superscript/Subscript */}
        <div className="flex gap-1 border-r border-zinc-300 pr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            isActive={editor.isActive("superscript")}
            title="Superscript"
            label="Super"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            isActive={editor.isActive("subscript")}
            title="Subscript"
            label="Sub"
          />
        </div>

        {/* Links & Images */}
        <div className="flex gap-1 border-r border-zinc-300 pr-2">
          <div className="flex items-center gap-1">
            <input
              ref={linkInputRef}
              type="text"
              placeholder="URL (select text first)"
              className="px-2 py-1 text-xs rounded border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-900 w-40"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddLink();
                }
              }}
            />
            <ToolbarButton
              onClick={handleAddLink}
              icon={<LinkIcon size={16} />}
              title="Add Link (select text first)"
            />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            multiple
          />
          <ToolbarButton
            onClick={() => fileInputRef.current?.click()}
            icon={<ImageIcon size={16} />}
            title="Upload Images (Multiple)"
          />
        </div>

        {/* Advanced */}
        <div className="flex gap-1 border-r border-zinc-300 pr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Rule"
            label="HR"
          />
        </div>

        {/* Color Picker */}
        <div className="flex gap-1 border-r border-zinc-300 pr-2 items-center">
          <label className="flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-zinc-100 rounded transition-colors">
            <Palette size={16} className="text-zinc-700" />
            <input
              type="color"
              defaultValue="#000000"
              onChange={(e) => {
                editor.chain().focus().setColor(e.target.value).run();
              }}
              className="w-8 h-8 rounded cursor-pointer border-0"
              title="Text Color (select text first)"
            />
          </label>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            icon={<RotateCcw size={16} />}
            title="Undo"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            icon={<RotateCw size={16} />}
            title="Redo"
          />
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  icon?: React.ReactNode;
  label?: string;
  title: string;
}

function ToolbarButton({
  onClick,
  isActive,
  icon,
  label,
  title,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "px-2 py-1 text-sm font-medium rounded transition-colors flex items-center gap-1 whitespace-nowrap",
        isActive
          ? "bg-zinc-900 text-white"
          : "bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-300",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
