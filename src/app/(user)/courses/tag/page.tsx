import React from "react";
import { Suspense } from "react";
import TagClient from "./TagClient";

export default function CoursesByTagPage() {
    return (
        <Suspense fallback={<div />}>
            {/* Render client component that uses useSearchParams inside a Suspense boundary */}
            <TagClient />
        </Suspense>
    );
}
