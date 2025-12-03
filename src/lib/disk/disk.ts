import { TDiskDirectory, TDiskFile, TDiskUploadLink } from "./types";

class Base {
  private basePath = "https://cloud-api.yandex.net/v1/disk/resources";
  private headers = {};

  constructor() {
    this.headers = {
      Authorization: `OAuth ${process.env.YANDEX_TOKEN}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  }

  get = {
    one: ({ path }: { path: string }): Promise<TDiskDirectory | TDiskFile> => {
      const params = new URLSearchParams({ path, limit: "1000" });

      try {
        return fetch(`${this.basePath}?${params}`, {
          method: "GET",
          headers: this.headers,
        }).then((res) => res.json());
      } catch (error) {
        const e = error as Error;

        console.error(e);
        throw new Error(e?.message || "Something went wrong during GET one disk folder call.");
      }
    },

    all: async (): Promise<Array<TDiskDirectory>> => {
      const params = new URLSearchParams({
        path: process.env.FOLDER_PATH as string,
        limit: "300",
      });

      try {
        const response = await fetch(`${this.basePath}?${params}`, {
          method: "GET",
          headers: this.headers,
        });

        const folders = await response.json();

        return folders._embedded?.items.filter(
          (t: TDiskDirectory) =>
            t.type === "dir" && t.name !== "face" && t.name !== "naked" && t.name !== "Red Head",
        );
      } catch (error) {
        const e = error as Error;

        console.error(e);
        throw new Error(e?.message || "Something went wrong during GET all disk folders call.");
      }
    },
  };

  create({ path }: { path: string }) {
    const params = new URLSearchParams({ path, fields: "name" });

    try {
      return fetch(`${this.basePath}?${params}`, {
        method: "PUT",
        headers: this.headers,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res?.error) {
            throw new Error(res?.error);
          }
        });
    } catch (error) {
      const e = error as Error;

      console.error(e);
      throw new Error(e?.message || "Something went wrong during GET disk call.");
    }
  }

  delete({ path }: { path: string }) {
    const params = new URLSearchParams({ path, permanently: "true" });

    try {
      return fetch(`${this.basePath}?${params}`, {
        method: "DELETE",
        headers: this.headers,
      })
        .then((res) => {
          if (res.status === 204) return;

          const type = res.headers.get("content-type");
          return type?.includes("text/html") ? res.text() : res.json();
        })
        .then((res) => {
          if (res?.error) {
            throw new Error(res?.description || res?.error);
          }
        });
    } catch (error) {
      const e = error as Error;

      console.error(e);
      throw new Error(e?.message || "Something went wrong during GET disk call.");
    }
  }

  async upload({ path, file }: { path: string; file: File }) {
    const params = new URLSearchParams({ path });

    try {
      const response = await fetch(`${this.basePath}/upload?${params}`, {
        method: "GET",
        headers: this.headers,
      });

      const { href, method } = (await response.json()) as TDiskUploadLink;

      return await fetch(href, {
        method: method,
        body: file,
        headers: this.headers,
      });
    } catch (error) {
      const e = error as Error;

      console.error(e);
      throw new Error(e?.message || "Something went wrong during GET one disk folder call.");
    }
  }
}

export const disk = new Base();
