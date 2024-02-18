import React from "react";

interface UserImageProps {
    file_src: string
}

export default function UserImage({file_src}: UserImageProps) {
    return (
        <div className="user-image-container">
            <img src={file_src}
                 alt="user-image"/>
        </div>
    )
}