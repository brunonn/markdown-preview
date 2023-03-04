export const MdStorage = {
  setItem: (md: string) => {
    localStorage.setItem("md2pdf__md", md);
  },
  getItem: () => {
    return localStorage.getItem("md2pdf__md");
  },
};

export const FileStorage = {
  setItem: (key: string, value: string) => {
    localStorage.setItem(`md2pdf__file__${key}`, value);
  },
  getItem: (key: string) => {
    return localStorage.getItem(`md2pdf__file__${key}`);
  },
  removeItem: (key: string) => {
    const storageKeys = localStorage.getItem("md2pdf__file-keys");
    if (!storageKeys) {
      return localStorage.removeItem(`md2pdf__file__${key}`);
    }
    const currentKeys = JSON.parse(storageKeys) as string[];
    const updatedKeys = currentKeys.filter((storage) => storage !== key);
    localStorage.setItem("md2pdf__file-keys", JSON.stringify(updatedKeys));

    return localStorage.removeItem(`md2pdf__file__${key}`);
  },
  appendKeys: (keys: string[]) => {
    const storageKeys = localStorage.getItem("md2pdf__file-keys");
    if (!storageKeys) {
      return localStorage.setItem("md2pdf__file-keys", JSON.stringify(keys));
    }
    const currentKeys = JSON.parse(storageKeys) as string[];
    localStorage.setItem(
      "md2pdf__file-keys",
      JSON.stringify([...currentKeys, ...keys])
    );
  },
  getKeys: () => {
    const keys = localStorage.getItem("md2pdf__file-keys");
    if (!keys) {
      return null;
    }
    return JSON.parse(keys) as string[];
  },
};
