import type { RcFile } from "antd/es/upload/interface";

export const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

export const downloadFile = (fileName: string, base64url: string) => {
  // Convert base64url to base64 by replacing non-url compatible chars
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");

  // Convert base64 to raw binary data held in a string
  const raw = atob(base64);

  // Convert raw binary data to a Uint8Array
  const uint8Array = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    uint8Array[i] = raw.charCodeAt(i);
  }

  // Create a Blob object from the raw data
  const blob = new Blob([uint8Array], { type: "application/octet-stream" });

  // Create a temporary anchor element
  const a = document.createElement("a");
  a.style.display = "none";
  document.body.appendChild(a);

  // Create a link to the file
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;

  // Trigger the download
  a.click();

  // Clean up
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
