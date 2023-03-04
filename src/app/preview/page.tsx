"use client";
import { MyMarkdown } from "../MyMarkdown";
import { redirect } from "next/navigation";
import { MdStorage } from "../storage";

export default function Preview() {
  const markdown = MdStorage.getItem();
  if (!markdown) {
    redirect("/");
  }

  return <MyMarkdown className="container">{markdown}</MyMarkdown>;
}
