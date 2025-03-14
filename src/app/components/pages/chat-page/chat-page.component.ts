import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../services/chat/chat.service';
import { ChatRoomComponent } from "../../chat/chat-room/chat-room.component";
import { ChatListComponent } from '../../chat/chat-list/chat-list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css'],
  standalone:true,
  imports : [ChatRoomComponent, CommonModule, ChatListComponent],
})
export class ChatPageComponent implements OnInit {
  contacts: any[] = []; // Lista de contatos/conversas
  selectedChatRoom: any = null; // ChatRoom selecionado
  messages: any[] = []; // Mensagens carregadas
  userId: number = 0; // ID do usuário logado
  selectedChatRoomId: string = ''; // Guarda o ID do chat selecionado

  onChatRoomSelected(chatRoomId: string): void {
    this.selectedChatRoomId = chatRoomId; // Atualiza o ID selecionado
  }


  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    // Obtém o ID do usuário logado (por exemplo, do token ou localStorage)
    this.userId = Number(localStorage.getItem('userId'));
  
    // Carrega os contatos/conversas do usuário
    this.loadContacts();
  
    // Inicializa o WebSocket
    this.chatService.initializeWebSocket(this.userId);
  
    // Escuta novas mensagens via WebSocket
    this.chatService.onMessage().subscribe((newMessage) => {
      if (this.selectedChatRoom && newMessage.chatRoomId === this.selectedChatRoom.id) {
        this.messages.push(newMessage);
        this.messages.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()); // Ordena as mensagens por data
      }
    });
  }

  // Carrega a lista de contatos/conversas do usuário
  loadContacts(): void {
    this.chatService.getContacts().subscribe({
      next: (contacts) => {
        console.log('Contatos recebidos:', contacts);
        this.contacts = contacts; // ou similar
      },
      error: (err) => console.error('Erro ao buscar contatos:', err),
    });
  }    

  // Seleciona um chat room e carrega suas mensagens
  onSelectChatRoom(chatRoomId: string): void {
    console.log('ChatRoom selecionado:', chatRoomId);
  
    // Verifica se o chatRoom já está selecionado
    if (this.selectedChatRoom?.id === chatRoomId) {
      return; // Já está selecionado
    }
  
    // Busca o contato correspondente ao chatRoomId
    let selectedContact: any;
    for (const contact of this.contacts) {
      if (contact.id === Number(chatRoomId)) {
        selectedContact = contact;
        break;
      }
    }
  
    if (!selectedContact) {
      console.error('Contato não encontrado para o chatRoomId:', chatRoomId);
      return;
    }
  
    // Busca as mensagens do chatRoom selecionado
    this.chatService.getMessages(chatRoomId).subscribe(
      (messages) => {
        // Atualiza o chatRoom selecionado
        this.selectedChatRoom = selectedContact;
  
        // Atualiza as mensagens e ordena por data
        this.messages = messages.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
  
        console.log('ChatRoom definido:', this.selectedChatRoom);
        console.log('Mensagens carregadas:', this.messages);
      },
      (error) => {
        console.error('Erro ao carregar mensagens:', error);
      }
    );
  }
  
  // Envia uma mensagem
  onSendMessage(messageContent: string): void {
    if (!this.selectedChatRoom || !messageContent.trim()) {
      console.error('Erro: selectedChatRoom está undefined ou mensagem vazia');
      return;
    }
  
    const receiverId = this.selectedChatRoom.id; // ID do destinatário
    const senderId = this.userId; // ID do remetente (usuário logado)
    const chatRoomId = this.selectedChatRoom.id; // ID da sala de chat
  
    if (!receiverId || !senderId || !chatRoomId) {
      console.error('Erro: receiverId, senderId ou chatRoomId está undefined');
      return;
    }
  
    // Envia a mensagem via WebSocket (ou HTTP como fallback)
    this.chatService.sendMessageWebSocket(
      chatRoomId.toString(),
      messageContent,
      senderId.toString(),
      receiverId.toString()
    );
  }
}
