import { Mail } from './../../Models/mail';
import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Subscription } from 'rxjs';

const headers = new HttpHeaders({
  'Content-Type': 'application/x-www-form-urlencoded'
});

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css']
})


@Injectable()
export class SendComponent implements OnInit {
  public getData: string;
  public newMail: Mail;
  public recipients: Array<string>;
  subscription: Subscription;
  numberOfInputs: number;


  // Czy można dodać plik txt
  loadTextFile: boolean;
  // Czy można dodać plik excel
  loadExcelFile: boolean;
  // Czy można dodać plik bazy danych
  loadDatabaseFile: boolean;

  // Grupa form
  formGroup = this.fb.group({
    file: [null, Validators.required]
  });



  constructor(private http: HttpClient, private fb: FormBuilder) { }

  ngOnInit() {
    this.numberOfInputs = 0;
    this.recipients = new Array();
    this.getServerData().subscribe(res => {
      console.log(res);
    });
    this.newMail = new Mail();
    this.loadTextFile = false;
    this.loadExcelFile = false;
    this.loadDatabaseFile = false;
  }

  getServerData(): Observable<string> {
    return this.http.get<string>('https://localhost:44310/api/Mail', {responseType: 'text' as 'json'});
  }

  sendMessage() {

    // Pobranie z formy danych wprowadzonych przez użytkownika
    this.newMail.Sender = (document.getElementById('Sender') as HTMLInputElement).value;
    this.newMail.Password = (document.getElementById('Password') as HTMLInputElement).value;
    this.newMail.Subject = (document.getElementById('Subject') as HTMLInputElement).value;
    this.newMail.Message = (document.getElementById('Message') as HTMLInputElement).value;
    this.newMail.Recipients = new Array();

    // Pobranie adresatów oraz dodanie ich do tablicy
    for (let i = 0 ; i < this.numberOfInputs; i++) {
      this.newMail.Recipients.push((document.getElementById(i.toString()) as HTMLInputElement).value);
    }

    // Wysłanie requesta post do Web Api wraz z obiektem
    this.http.post('https://localhost:44310/api/Mail/send', {
    Sender: this.newMail.Sender,
    Password: this.newMail.Password,
    Subject: this.newMail.Subject,
    Message: this.newMail.Message,
    Recipients: this.newMail.Recipients
  }).subscribe(res => console.log(res));
  }

  // Dodanie nowych adresatów
  addNewRecipient() {
    this.recipients.push(" ");
    this.numberOfInputs++;
  }

  // Załadowanie adresatów z pliku tekstowego
  loadRecipientsFromTextFile() {
    this.loadTextFile = !this.loadTextFile;
  }

  // Wczytanie danych z pliku
  RecipientsFromTextFile(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.formGroup.patchValue({
          file: reader.result
        });
      };
    }
    console.log(this.formGroup);
  }

  // Załadowanie adresatów z pliku excel
  loadRecipientsFromExcelFile() {
    this.loadExcelFile = !this.loadExcelFile;
  }

  // Załadowanie adresatów z pliku bazy danych
  loadRecipientsFromDatabaseFile() {
    this.loadDatabaseFile = !this.loadDatabaseFile;
  }

  // Usunięcie pola z adresatem
  closeRecipientInput(index) {
    this.recipients.splice(index, 1);
  }
}
