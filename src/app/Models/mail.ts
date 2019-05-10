import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';

export class Mail {
    // Nadawca
    public Sender: string;
    // Hasło
    public Password: string;
    // Temat
    public Subject: string;
    // Wiadomość
    public Message: string;
    // Adresaci
    public Recipients: Array<string>;
}
