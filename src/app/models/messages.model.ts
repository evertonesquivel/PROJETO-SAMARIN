export interface Message {
    id: number;
    content: { text: string }; // Supondo que o conteúdo seja um JSON com um campo `text`
    is_read: boolean;
    sentAt: Date;
    chat_room_id: number;
    sender_id: number;
    receiver_id: number;
    is_deleted: boolean;
  }
  