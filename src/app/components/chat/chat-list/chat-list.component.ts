import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatService } from '../../../services/chat/chat.service';
import { CommonModule } from '@angular/common'; 
@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
  standalone : true,
  imports : [CommonModule]
})
export class ChatListComponent implements OnInit {
  @Input() conversations: any[] = []; // Lista de conversas
  @Output() selectConversation = new EventEmitter<string>(); // Emite chatRoomId selecionado

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    if (!this.conversations.length) {
      this.loadConversations();
    }
  }

  // Carrega as conversas se a lista estiver vazia
  loadConversations(): void {
    this.chatService.getConversations().subscribe({
      next: (data) => {
        this.conversations = data;
      },
      error: (err) => {
        console.error('Erro ao carregar conversas:', err);
      },
    });
  }

  // Emitir evento de seleção de conversa
  onSelectConversation(chatRoomId: string): void {
    this.selectConversation.emit(chatRoomId);
  }
}
