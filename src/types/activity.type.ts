// types.ts
export interface Reply {
    id: string;
    author: string;
    content: string;
    createdAt: string;
}

export interface Activity {
    id: string;
    actor: string;
    action: string;
    timestamp: string;
    replies: Reply[];
}
