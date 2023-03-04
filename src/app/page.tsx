"use client";

import { useState, useRef, useEffect } from "react";
import { MyMarkdown } from "./MyMarkdown";
import Link from "next/link";
import { AiFillEye, AiFillFileAdd, AiFillDelete } from "react-icons/ai";
import styles from "./home.module.css";
import { FileStorage, MdStorage } from "./storage";
import { convertBase64 } from "@/utils/file.utils";

async function cacheFiles(files: File[] | null) {
  if (!files) {
    return;
  }
  const convertFiles = files.map(async (file) => {
    const base64 = await convertBase64(file);
    return { key: file.name, value: base64 };
  });
  const base64Files = await Promise.all(convertFiles);
  base64Files.forEach((f) => {
    FileStorage.setItem(f.key, f.value);
  });
  FileStorage.appendKeys(base64Files.map((d) => d.key));
}
export default function Home() {
  const [markdown, setMarkdown] = useState(MdStorage.getItem() ?? "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      MdStorage.setItem(markdown);
    }, 300);
    return () => {
      clearTimeout(timeout);
    };
  }, [markdown]);

  const [files, setFiles] = useState<
    (File | { name: string; storage: boolean })[] | null
  >(
    FileStorage.getKeys()?.map((key) => ({ name: key, storage: true })) ?? null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    cacheFiles(files?.filter((f) => !f.storage) ?? null);
  }, [files]);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>Markdown preview</h1>

        <Link href="/preview" target="_blank">
          <button>
            See the preview
            <AiFillEye width="5em" height="5em" />
          </button>
        </Link>
      </header>
      <div className={styles.files}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fileInputRef.current?.click();
          }}
        >
          <input
            type="file"
            onChange={(e) => {
              const f = e.target.files;
              if (!f) {
                return f;
              }
              setFiles((previous) => {
                if (!previous) {
                  return [...f];
                }
                return [...previous, ...f];
              });
            }}
            multiple
            hidden
            ref={fileInputRef}
          />
          <button>
            Add files
            <AiFillFileAdd />
          </button>
        </form>
        {files &&
          [...files].map((file) => (
            <div className={styles["file-item"]} key={file.name}>
              <a>{file.name}</a>
              <button
                title={`Delete ${file.name}`}
                onClick={() => {
                  setFiles(
                    (previous) => previous?.filter((f) => f !== file) ?? null
                  );
                  FileStorage.removeItem(file.name);
                }}
              >
                <AiFillDelete />
              </button>
            </div>
          ))}
      </div>
      <div className={styles["md-container"]}>
        <textarea
          id="markdown"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
        />
        <div>
          <MyMarkdown>{markdown}</MyMarkdown>
        </div>
      </div>
    </main>
  );
}
