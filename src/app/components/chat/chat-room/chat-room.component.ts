// chat-room.component.ts
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ChatService } from '../../../services/chat/chat.service';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { MessageInputComponent } from '../message-input/message-input.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Message } from '../../../models/messages.model';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
  standalone: true,
  imports: [ChatMessageComponent, MessageInputComponent, FormsModule, CommonModule],
})
export class ChatRoomComponent implements OnInit {
  @Input() chatRoom: any; // Dados da sala de chat
  @Input() messages: Message[] = []; // Lista de mensagens
  @Output() sendMessage: EventEmitter<string> = new EventEmitter<string>(); // Emite a mensagem para o componente pai

  newMessage: string = ''; // Armazena o texto da mensagem

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    if (this.chatRoom?.id) {
      this.loadMessages();

      // Ouve novas mensagens recebidas via WebSocket
      this.chatService.onMessage().subscribe((message) => {
        if (message.chatRoomId === this.chatRoom.id) {
          this.messages.push(message);
        }
      });
    }
  }

  loadMessages(): void {
    if (this.chatRoom?.id) {
      this.chatService.getMessages(this.chatRoom.id).subscribe(
        (data: any) => {
          console.log('Mensagens carregadas:', data);
  
          if (Array.isArray(data)) {
            // Se `data` for um array, converte cada item para o formato do modelo
            this.messages = data.map((msg) => this.mapToMessage(msg));
          } else if (data && typeof data === 'object') {
            // Se `data` for um único objeto, envolve em um array e converte
            this.messages = [this.mapToMessage(data)];
          } else {
            console.error('Formato inesperado de mensagens:', data);
            this.messages = [];
          }
        },
        (error) => {
          console.error('Erro ao carregar mensagens:', error);
          this.messages = [];
        }
      );
    }
  }
  
  private mapToMessage(data: any): Message {
    return {
      id: data.id,
      content: data.content,
      is_read: !!data.is_read, // Converte para boolean
      sentAt: new Date(data.sentAt), // Converte para Date
      chat_room_id: data.chat_room_id,
      sender_id: data.sender_id,
      receiver_id: data.receiver_id,
      is_deleted: !!data.is_deleted, // Converte para boolean
    };
  }
  
  
  // Envia a mensagem para o componente pai
  sendMessageToParent(event: any): void {
    const message = event.target.value; // Aqui capturamos a string de `newMessage` do evento
    if (message.trim() && this.chatRoom?.id) {
      this.sendMessage.emit(message); // Emite a mensagem para o componente pai
      this.newMessage = ''; // Limpa o campo de entrada após o envio
    } else {
      console.warn('Mensagem vazia ou sala de chat inválida.');
    }
  }
}
