import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from "@angular/router";
import { io, Socket } from 'socket.io-client'; // Importa socket.io-client

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:3000'; // URL do backend
  private socket: Socket | null = null; // Atualiza para usar Socket de socket.io-client
  private messagesSubject = new Subject<any>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(private http: HttpClient, private router: Router) {}

  // Retorna cabeçalhos com autenticação
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Alterado de 'token' para 'authToken'
    console.log('Token obtido:', token); // Verifique no console se o token está correto
    if (!token) {
      console.error('Token não encontrado!');
      // Possível redirecionamento para a tela de login:
      this.router.navigate(['/login']);
      throw new Error('Token não encontrado!');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Inicializar conexão WebSocket
  initializeWebSocket(userId: number): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token não encontrado!');
      return;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Máximo de tentativas de reconexão atingido.');
      return;
    }

    console.log('Tentando conectar ao WebSocket...');
    this.socket = io(this.apiUrl, {
      query: { userId, token },
      transports: ['websocket']
    });

    this.socket.on('connect', () => {
      console.log('WebSocket conectado');
      this.reconnectAttempts = 0; // Resetar contagem em sucesso
    });

    this.socket.on('newMessage', (message) => {
      this.messagesSubject.next(message); // Notificar mensagens recebidas
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('WebSocket desconectado:', reason);
      this.reconnectAttempts++;
      setTimeout(() => this.initializeWebSocket(userId), 5000); // Reconnect após 5s
    });

    this.socket.on('connect_error', (error) => {
      console.error('Erro no WebSocket:', error);
    });
  }

  // Observar mensagens recebidas via WebSocket
  onMessage(): Observable<any> {
    return this.messagesSubject.asObservable();
  }

  // Enviar uma mensagem pelo WebSocket
  sendMessageWebSocket(chatRoomId: string, message: string, senderId: string, receiverId: string): void {
    if (this.socket && this.socket.connected) {
      // Monta o payload com o formato correto
      const payload = {
        chatRoomId,
        content: { text: message }, // Formato esperado pelo backend
        senderId,
        receiverId,
      };
      this.socket.emit('sendMessage', payload);
    } else {
      console.warn('WebSocket desconectado. Tentando enviar via HTTP...');
      this.sendMessage(chatRoomId, { text: message }, senderId, receiverId).subscribe(
        (response) => console.log('Mensagem enviada via HTTP:', response),
        (error) => console.error('Erro ao enviar mensagem via HTTP:', error)
      );
    }
  }

  // Fechar conexão WebSocket
  closeWebSocket(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  // Obter lista de conversas do usuário
  getConversations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/conversations`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError(error => {
        console.error('Erro ao obter conversas:', error);
        return throwError(() => error);
      })
    );
  }

  // Obter mensagens de um chat room específico
  getMessages(chatRoomId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/messages/${chatRoomId}`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError(error => {
        console.error(`Erro ao obter mensagens do chat ${chatRoomId}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Enviar uma mensagem para um chat room via HTTP
  sendMessage(chatRoomId: string, content: { text: string }, senderId: string, receiverId: string): Observable<any> {

  
  
    console.log('Enviando mensagem para o backend:');
    console.log('chatRoomId:', chatRoomId);
    console.log('message:', content);
    console.log('receiverId:', receiverId);
  
    if (!receiverId) {
      console.error('Erro: receiverId está undefined');
      return throwError(() => new Error('receiverId está undefined'));
    }
  
    const payload = { content: content, chatRoomId, receiverId };
    return this.http.post<any>(`${this.apiUrl}/send`, payload, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError(error => {
        console.error('Erro ao enviar mensagem:', error);
        return throwError(() => error);
      })
    );
  }
  // Atualizar lista de mensagens local
  updateMessagesLocally(newMessage: any): void {
    this.messagesSubject.next(newMessage); // Notifica a aplicação
  }

  // Obter lista de contatos ou conversas do usuário
  getContacts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/contacts`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError(error => {
        console.error('Erro ao obter contatos:', error);
        return throwError(() => error);
      })
    );
  }
  
}
