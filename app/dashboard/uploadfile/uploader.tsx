"use client";
import { useState, useCallback, useMemo, ChangeEvent } from "react";
import { toast } from "sonner";
export default function Uploader(){
    const [data, setData] = useState<{
        image: string | null;
    }>({
        image: null,
    });

    const [file, setFile] = useState<File | null>(null);

    const url = 'http://localhost:3000/api/upload';
    const formData = new FormData();
    const onChangePicture = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.currentTarget.files && event.currentTarget.files[0];
            if (file) {
                if (file.size / 1024 / 1024 > 50) {
                    toast.error("File size too big (max 50MB)");
                } else {
                    setFile(file);
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setData((prev) => ({ ...prev, image: e.target?.result as string }));
                    };
                    reader.readAsDataURL(file);
                }
            }
        },
        [setData],
    );

    const [saving, setSaving] = useState(false);

    const saveDisabled = useMemo(() => {
        return !data.image || saving;
    }, [data.image, saving]);


    return (
      <div>
          <form onSubmit={async (e) => {
              e.preventDefault();
              setSaving(true);
              fetch(url, {
                  method: "POST",
                  headers: { "content-type": file?.type || "application/octet-stream" },
                  body: file,
              }).then(async (res) => {
                  console.log(res.status);
                  if (res.status === 200) {
                      console.log(res.status);
                      const { url } = await res.json();
                      console.log(url);
                      toast(
                          <div className="relative">
                              <div className="p-2">
                                  <p className="font-semibold text-gray-900">File uploaded!</p>
                                  <p className="mt-1 text-sm text-gray-500">
                                      Your file has been uploaded to{" "}
                                      <a
                                          className="font-medium text-gray-900 underline"
                                          href={url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                      >
                                          {url}
                                      </a>
                                  </p>
                              </div>
                          </div>,
                      );
                  } else {
                      const error = await res.text();
                      toast.error(error);
                  }
                  setSaving(false);
              });
          }}>
              <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                  <input
                      id="image"
                      name="image"
                      type="file"
                      onChange={onChangePicture}
                  />
                  <button className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >upload
                  </button>
              </div>
          </form>
      </div>
    );
}