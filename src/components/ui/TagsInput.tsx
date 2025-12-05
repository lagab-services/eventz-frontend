import React, { useState, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type TagsInputProps = {
    value?: string[];
    onChange?: (tags: string[]) => void;
    className?: string;
};

export const TagsInput: React.FC<TagsInputProps> = ({
                                                        value,
                                                        onChange,
                                                        className,
                                                        ...props
                                                    }) => {
    const [tags, setTags] = useState<string[]>(value ?? []);
    const [input, setInput] = useState<string>("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    const updateTags = (newTags: string[]) => {
        setTags(newTags);
        onChange?.(newTags);
    };

    const addTag = (tag: string) => {
        const t = tag.trim();
        if (!t || tags.includes(t)) return;
        updateTags([...tags, t]);
    };

    const removeTag = (t: string) => {
        updateTags(tags.filter((tag) => tag !== t));
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag(input);
            setInput("");
        }

        if (e.key === "Backspace" && input === "" && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    };

    return (
        <div className={cn("flex w-full flex-col gap-2", className)} {...props}>
            <div
                className={cn(
                    "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-background",
                    "px-3 py-2 text-sm focus-within:ring-1 focus-within:ring-ring"
                )}
            >
                {tags.map((tag) => (
                    <TagItem key={tag} onRemove={() => removeTag(tag)}>
                        {tag}
                    </TagItem>
                ))}

                <input
                    ref={inputRef}
                    value={input}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setInput(e.target.value)
                    }
                    onKeyDown={onKeyDown}
                    className="flex-1 bg-transparent outline-hidden placeholder:text-muted-foreground"
                    placeholder="Add tag…"
                />
            </div>
        </div>
    );
};

type TagItemProps = {
    children?: React.ReactNode;
    onRemove?: () => void;
};

export const TagItem: React.FC<TagItemProps> = ({ children, onRemove }) => (
    <span
        className={cn(
            "inline-flex items-center gap-1.5 rounded border bg-muted px-2.5 py-1",
            "text-sm"
        )}
    >
    <span className="truncate">{children}</span>
    <button
        type="button"
        onClick={onRemove}
        className="size-4 shrink-0 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
    >
      <X className="size-3.5" />
    </button>
  </span>
);
