export interface TDiskDirectory {
  name: string;
  created: string;
  modified: string;
  path: string;
  type: "dir";

  _embedded?: {
    items: Array<TDiskDirectory | TDiskFile>;
  };
}

// Both "TDiskFile.file" links and "TDiskFile.sizes" links are dynamic fields
// Yandex change them every 24 hours
export interface TDiskFile {
  name: string;
  file: string;
  preview: string;
  media_type: string;
  mime_type: string;
  path: string;
  size: number;
  created: string;
  md5: string;
  modified: string;
  type: "file";
  sizes: Array<{
    name: string;
    url: string;
  }>;
}

export interface TDiskUploadLink {
  operation_id: string;
  href: string;
  method: "PUT";
  templated: boolean;
}
