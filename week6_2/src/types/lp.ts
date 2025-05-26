import { ReactNode } from "react";
import { CursorBaedResponse } from "./commons";

export type Tag={
    id:number;
    name:string;
}

export type Likes={
    id: number;
    userId: number;
    lpId: number;
}

export type Lp= {
    releaseDate: ReactNode;
    artist: ReactNode;
    id:number;
    title: string,
    content: string,
    thumbnail: string,
    published: boolean,
    authorId: number,
    createdAt: Date,
    updatedAt: Date,
    tags: Tag[];
    likes: Likes[];
};

export type ResponseLpListDto=CursorBaedResponse<Lp[]>;