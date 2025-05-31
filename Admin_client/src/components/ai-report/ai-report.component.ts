
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AiService } from '../../services/ai.service';
import { FormsModule } from '@angular/forms';
import { SimpleEditorComponent } from '../simple-editor/simple-editor.component';

@Component({
  selector: 'app-ai-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SimpleEditorComponent
  ],
  templateUrl: './ai-report.component.html',
  styleUrls: ['./ai-report.component.css']
})
export class AiReportComponent {
  emailDraft: string = '';
  showPopup: boolean = false;
  errorMessage: string = '';
  editorContent: string = '';
  isGenerating: boolean = false;
  isSending: boolean = false;
  prompt = `צור טיוטה של מייל שיווקי בעברית עבור משתמשים שמכינים לוח שנה אישי עם תמונות לפי תאריך ,באתר MOMENTO. סגנון קליל, מזמין, עם קריאה לפעולה ברורה.`;

  sendingProgress: { total: number, sent: number, failed: number } = {
    total: 0,
    sent: 0,
    failed: 0
  };

  constructor(
    private http: HttpClient,
    private aiService: AiService
  ) { }

  generateMarketingEmail() {
    this.showPopup = true;
    this.emailDraft = '';
    this.editorContent = '';
    this.errorMessage = '';
    this.isGenerating = true;

    this.aiService.sendMessage(this.prompt)
      .subscribe({
        next: res => {
          this.isGenerating = false;
          this.emailDraft = res.choices[0].message.content;
          const formattedContent = `<div dir="rtl" style="text-align: right;">${this.emailDraft}</div>`;
          this.editorContent = formattedContent;
        },
        error: err => {
          this.isGenerating = false;
          console.error(err);
          this.errorMessage = 'אירעה שגיאה בקבלת הטיוטה';
        }
      });
  }



  sendToAll() {
    this.sendingProgress = {
      total: 0,
      sent: 0,
      failed: 0
    };

    this.isSending = true;

    this.aiService.getEmails().subscribe({
      next: emails => {
        const emailList = Array.isArray(emails) ? emails : [];
        this.sendingProgress.total = emailList.length;

        if (emailList.length === 0) {
          this.isSending = false;
          this.errorMessage = 'אין כתובות מייל לשליחה';
          return;
        }

        emailList.forEach(email => {
          const emailData = {
            to: email,
            subject: 'עדיין לא יצרתם MomenTo?! - זה הזמן!',
            body: this.editorContent,
          };

          this.aiService.sendEmail(emailData).subscribe({
            next: response => {
              this.sendingProgress.sent++;

              if (this.sendingProgress.sent + this.sendingProgress.failed === this.sendingProgress.total) {
                this.isSending = false;
                
                  setTimeout(() => {
                    this.closePopup();
                  }, 1000);
              }
            },
            error: error => {
              console.error('Error sending email:', error);
              this.sendingProgress.failed++;

              if (this.sendingProgress.sent + this.sendingProgress.failed === this.sendingProgress.total) {
                this.isSending = false;

              }
            }
          });
        });
      },
      error: error => {
        console.error('Error getting email list:', error);
        this.errorMessage = 'אירעה שגיאה בקבלת רשימת המיילים';
        this.isSending = false;
      }
    });
  }

  closePopup() {
    if (this.isSending) return;

    this.showPopup = false;
    this.emailDraft = '';
    this.editorContent = '';
    this.errorMessage = '';
  }

  getSendingPercentage(): number {
    if (this.sendingProgress.total === 0) return 0;
    return Math.round(
      ((this.sendingProgress.sent + this.sendingProgress.failed) / this.sendingProgress.total) * 100
    );
  }
}