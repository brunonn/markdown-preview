import ReactMarkdown from "react-markdown";
import { ComponentProps } from "react";

import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { FileStorage } from "./storage";

type MyMarkdownProps = ComponentProps<typeof ReactMarkdown>;

export const MyMarkdown = ({ ...props }: MyMarkdownProps) => {
  return (
    <ReactMarkdown
      components={{
        a: (props) => <a target="_blank" {...props} />,
        img: (props) => {
          const base64Src = FileStorage.getItem(props.src);
          return <img {...props} src={base64Src} />;
        },
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              children={String(children).replace(/\n$/, "")}
              // style={dark}
              language={match[1]}
              PreTag="div"
              {...props}
            />
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
      remarkPlugins={[remarkGfm]}
      {...props}
    />
  );
};
