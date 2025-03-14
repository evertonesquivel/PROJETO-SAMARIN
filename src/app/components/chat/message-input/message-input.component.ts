import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class MessageInputComponent {
  message: string = '';

  @Output() sendMessage: EventEmitter<string> = new EventEmitter<string>();

  onSendMessage(): void {
    if (this.message.trim()) {
      this.sendMessage.emit(this.message); // Emite a mensagem para o pai
      this.message = ''; // Limpa o campo após o envio
    }
  }
}
