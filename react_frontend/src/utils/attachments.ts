import { faFile, faFilePdf, faImage } from "@fortawesome/free-solid-svg-icons";
import { AttachmentType } from "../types";

export const AttachmentTypes: AttachmentType[] = [
    {
        name: 'Image',
        icon: faImage,
        types: [
            'image/jpeg',
            'image/png',
        ]
    },
    {
        name: 'PDF',
        icon: faFilePdf,
        types: [
            'application/pdf',
        ]
    },
    {
        name: 'File',
        icon: faFile,
        types: [],
    }
]

export const SupportEditorAttachmentTypes = ['Image']

export const getAttactmentType = (type: string): AttachmentType => (
    AttachmentTypes.find(e => e.types.includes(type)) || AttachmentTypes.slice(-1)[0]
)