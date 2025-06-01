import React, { useRef, useEffect } from "react";

export interface ResizableTextareaProps {
  initialHeight?: number;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  name?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  disabled?: boolean;
}

const ResizableTextarea: React.FC<ResizableTextareaProps> = ({
  initialHeight = 100,
  placeholder = "",
  value,
  onChange,
  className = "",
  name,
  onKeyDown,
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineHeight = 24; // px, adjust if your textarea uses a different line height
  const maxLines = 5;
  const maxHeight = lineHeight * maxLines;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(
        Math.max(textareaRef.current.scrollHeight, initialHeight),
        maxHeight
      );
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [value, initialHeight]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full pr-12 bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-transparent active:outline-none active:ring-0 active:border-transparent shadow-none ${className}`}
      style={{
        minHeight: `${initialHeight}px`,
        maxHeight: `${maxHeight}px`,
        lineHeight: `${lineHeight}px`,
      }}
      name={name}
      onKeyDown={onKeyDown}
      disabled={disabled}
    />
  );
};

export default ResizableTextarea;
