import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

type ResponseData = {
    message:string
}

export async function POST(req: Request){
    console.log("post here");
    const file = req.body || "";
    const contentType = req.headers.get("content-type") || "text/plain";
    console.log("content type is : " + contentType);
    const filename = `${nanoid()}.${contentType.split("/")[1]}`;
    console.log("the file name is : ");
    console.log(filename);
    console.log("can't believe!!!");
    console.log(NextResponse.json(file));
    return NextResponse.json();
}