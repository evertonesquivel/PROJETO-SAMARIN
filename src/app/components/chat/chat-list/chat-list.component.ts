import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatService } from '../../../services/chat/chat.service';
import { DataManagerService } from '../../../services/user-data/data-manager.service'; // Importe o DataManagerService
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ChatListComponent implements OnInit {
  @Input() conversations: any[] = []; // Lista de conversas
  @Output() chatRoomSelected = new EventEmitter<string>(); // Emite chatRoomId selecionado
  contacts: any[] = []; // Lista de contatos/conversas
  messages: any[] = []; // Mensagens carregadas
  selectedChatRoom: any = null; // ChatRoom selecionado
  userId: number = 0; // ID do usuário logado

  constructor(
    private chatService: ChatService,
    private dataManagerService: DataManagerService // Injete o DataManagerService
  ) {}

  ngOnInit(): void {
    if (!this.conversations.length) {
      this.loadContacts();
    }

    // Escuta novas mensagens via WebSocket
    this.chatService.onMessage().subscribe((newMessage) => {
      if (this.selectedChatRoom && newMessage.chatRoomId === this.selectedChatRoom.id) {
        this.messages.push(newMessage);
      }
    });
  }

  // Carrega a lista de contatos/conversas do usuário
  loadContacts(): void {
    this.chatService.getContacts().subscribe({
      next: (contacts) => {
        console.log('Contatos recebidos:', contacts);
        this.contacts = contacts;

        // Para cada contato, busca o perfil e a primeira imagem
        this.contacts.forEach(contact => {
          this.loadContactProfile(contact.id);
        });
      },
      error: (err) => console.error('Erro ao buscar contatos:', err),
    });
  }

  // Busca o perfil do contato e atualiza a imagem
  loadContactProfile(userId: number): void {
    this.dataManagerService.getUserById(userId).subscribe({
      next: (profile) => {
        const contact = this.contacts.find(c => c.id === userId);
        if (contact) {
          contact.images = profile.images || ['/assets/default-profile.png']; // Atualiza as imagens do contato
        }
      },
      error: (err) => console.error('Erro ao buscar perfil do contato:', err),
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

        // Atualiza as mensagens
        this.messages = messages;

        // Emite o ID do chat room
        this.chatRoomSelected.emit(chatRoomId);

        console.log('ChatRoom definido:', this.selectedChatRoom);
        console.log('Mensagens carregadas:', this.messages);
      },
      (error) => {
        console.error('Erro ao carregar mensagens:', error);
      }
    );
  }
}