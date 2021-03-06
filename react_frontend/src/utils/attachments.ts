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

 export const humanFileSize = (bytes: number, si=true, dp=1): string => {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }

    const units = si
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10**dp;

    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

    return bytes.toFixed(dp) + ' ' + units[u];
}