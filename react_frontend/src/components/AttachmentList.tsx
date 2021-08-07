import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Tooltip } from "@material-ui/core";
import { ReactElement } from "react-markdown";
import { Attachment } from "../types";
import { getAttactmentType, humanFileSize } from "../utils/attachments";
import { color } from "../utils/css";
import { Modal } from "antd";
import { MouseEvent } from "react";
import { attachmentService } from "../services";

const { confirm } = Modal

interface AttachmentListProp {
  attachments: Attachment[]
  onUpdate: (removedAttachments: Attachment[]) => void
}

interface AttachmentItemProp {
  attachment: Attachment
}



export function AttachmentList (prop: AttachmentListProp): ReactElement {

  const AttachmentItem = (itemProp: AttachmentItemProp): ReactElement => {

    const attachmentType = getAttactmentType(itemProp.attachment.type)

    const handleRemove = (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      confirm({
        title: 'Remove attachment',
        content: <span>Do you want to remove <strong>{itemProp.attachment.name}</strong> from this report? Note: remove attachment does not change report content.</span>,
        okText: 'Remove',
        okType: 'danger',
        onOk: () => {
          attachmentService.remove(itemProp.attachment.id).then(() => {
            prop.onUpdate(prop.attachments.filter(e => e.id !== itemProp.attachment.id))
          })
        }
      })
    }

    const handleOpen = (event: MouseEvent<HTMLElement | MouseEvent>, url: string) => {
      event.stopPropagation()
      window.open(url, '_blank')
    }

    return (
      <Tooltip title={itemProp.attachment.name} placement="top">
        <Box className="attachment-item" display="inline-block" padding="0.5rem 1rem" margin="0 1rem 1rem 0" borderRadius="8px" style={{transition: '0.2s', cursor: 'pointer', background: 'white'}}>
          <Box display="flex" onClick={(e) => handleOpen(e, itemProp.attachment.url)} alignItems="center">
            <Box marginRight="0.8rem" fontSize="2rem">
              <FontAwesomeIcon icon={attachmentType.icon} />
            </Box>
            <Box>
              <Box fontWeight="bold">{itemProp.attachment.name.replace(/(.{16})..+/, "$1…")}</Box>
              <Box lineHeight="1rem" fontSize="0.8rem" >{attachmentType.name}</Box>
              <Box lineHeight="1rem" fontSize="0.8rem" marginBottom="0.2rem">{humanFileSize(itemProp.attachment.size)}</Box>
            </Box>
            <Tooltip title="Remove" placement="top">
              <Box marginLeft="0.5rem" onClick={handleRemove} color={color.gray}>
                <FontAwesomeIcon icon={faTrash} />
              </Box>
            </Tooltip>
          </Box>
        </Box>
      </Tooltip>
    )
  }

  return (
    <Box overflow="auto" whiteSpace="nowrap">
      {prop.attachments.map((attachment) => <AttachmentItem attachment={attachment} />)}
      {prop.attachments.length === 0 && <Box color={color.gray} fontStyle="italic">No attachments</Box>}
    </Box>
  )
}