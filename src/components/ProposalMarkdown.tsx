"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import { cn } from "@/lib/utils";
import matter from "gray-matter";
import { Components } from "react-markdown";
import "katex/dist/katex.min.css";

export function MarkdownRenderer({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  // Parse frontmatter if present
  const { content: markdownContent } = matter(content);

  // Preprocess markdown content to fix single-line tables
  const processedContent = preprocessMarkdownTables(markdownContent);

  const components: Components = {
    code({ className, children }) {
      const match = /language-(\w+)/.exec(className || "");
      return match ? (
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code className={className}>
            {String(children).replace(/\n$/, "")}
          </code>
        </pre>
      ) : (
        <code className={className}>{children}</code>
      );
    },
    // Enhanced table styling
    table({ children }) {
      return (
        <div className="my-6 w-full overflow-x-auto rounded-lg border border-border">
          <table className="w-full border-collapse text-sm">{children}</table>
        </div>
      );
    },
    thead({ children }) {
      return (
        <thead className="bg-muted/50 border-b border-border">{children}</thead>
      );
    },
    tbody({ children }) {
      return <tbody className="divide-y divide-border">{children}</tbody>;
    },
    tr({ children }) {
      return (
        <tr className="hover:bg-muted/50 transition-colors">{children}</tr>
      );
    },
    th({ children, align }) {
      return (
        <th
          className={`px-4 py-3 font-semibold text-left ${
            align === "center"
              ? "text-center"
              : align === "right"
              ? "text-right"
              : "text-left"
          }`}
        >
          {children}
        </th>
      );
    },
    td({ children, align }) {
      return (
        <td
          className={`px-4 py-2 ${
            align === "center"
              ? "text-center"
              : align === "right"
              ? "text-right"
              : "text-left"
          }`}
        >
          {children}
        </td>
      );
    },
    // Enhanced list styling
    ul({ children }) {
      return <ul className="list-disc pl-6 space-y-2 my-4">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="list-decimal pl-6 space-y-2 my-4">{children}</ol>;
    },
    // Enhanced heading styling
    h1({ children }) {
      return (
        <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">
          {children}
        </h1>
      );
    },
    h2({ children }) {
      return (
        <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">
          {children}
        </h2>
      );
    },
    h3({ children }) {
      return (
        <h3 className="text-xl font-semibold mt-4 mb-2 text-foreground">
          {children}
        </h3>
      );
    },
    // Enhanced paragraph styling
    p({ children }) {
      return <p className="my-4 leading-7">{children}</p>;
    },
  };

  return (
    <div
      className={cn(
        "prose max-w-full mx-auto p-4 dark:prose-invert",
        "prose-headings:font-semibold",
        "prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl",
        "prose-p:text-base prose-p:leading-relaxed",
        "prose-a:text-primary hover:prose-a:text-primary/80",
        "prose-img:rounded-lg",
        "prose-pre:bg-muted prose-pre:p-0",
        "prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:pl-4 prose-blockquote:italic",
        "prose-ul:list-disc prose-ol:list-decimal",
        "prose-li:my-1",
        "prose-table:border-collapse prose-table:w-full",
        "prose-th:border prose-th:border-border prose-th:p-2",
        "prose-td:border prose-td:border-border prose-td:p-2",
        "prose-strong:font-semibold",
        "prose-em:italic",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}

// Helper function to preprocess markdown tables
function preprocessMarkdownTables(content: string): string {
  // Split content into lines
  const lines = content.split("\n");
  let inTable = false;
  let tableLines: string[] = [];
  const processedLines: string[] = [];

  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this is a table line
    if (line.trim().startsWith("|")) {
      if (!inTable) {
        inTable = true;
        tableLines = [];
      }
      tableLines.push(line);
    } else if (inTable) {
      // Process the collected table lines
      if (tableLines.length > 0) {
        processedLines.push(...processTableLines(tableLines));
      }
      inTable = false;
      processedLines.push(line);
    } else {
      processedLines.push(line);
    }
  }

  // Process any remaining table lines
  if (inTable && tableLines.length > 0) {
    processedLines.push(...processTableLines(tableLines));
  }

  return processedLines.join("\n");
}

function processTableLines(lines: string[]): string[] {
  if (lines.length < 2) return lines;

  // Process header and separator
  const headerLine = lines[0];
  const separatorLine = lines[1];

  // Ensure proper spacing in header
  const processedHeader = headerLine
    .replace(/\|/g, " | ")
    .replace(/\|\s+\|/g, "|")
    .trim();

  // Ensure proper separator format
  const processedSeparator = separatorLine
    .replace(/\|/g, " | ")
    .replace(/\|\s+\|/g, "|")
    .replace(/\s*-\s*/g, "---")
    .trim();

  // Process data rows
  const processedDataRows = lines.slice(2).map((line) => {
    return line
      .replace(/\|/g, " | ")
      .replace(/\|\s+\|/g, "|")
      .trim();
  });

  return [processedHeader, processedSeparator, ...processedDataRows];
}
