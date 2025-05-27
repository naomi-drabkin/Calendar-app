// import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { AiService } from '../../services/ai.service';
// import { FormsModule } from '@angular/forms';
// import { SimpleEditorComponent } from '../simple-editor/simple-editor.component';
// import { ViewChild, ElementRef } from '@angular/core';

// @Component({
//   selector: 'app-ai-report',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     SimpleEditorComponent
//   ],
//   templateUrl: './ai-report.component.html',
//   styleUrls: ['./ai-report.component.css']
// })
// export class AiReportComponent {
//   emailDraft: string = '';
//   showPopup: boolean = false;
//   errorMessage: string = '';
//   editorContent: string = '';
//   isGenerating: boolean = false;
//   isSending: boolean = false;
//   sendingProgress: { total: number, sent: number, failed: number } = {
//     total: 0,
//     sent: 0,
//     failed: 0
//   };

//   @ViewChild('editor', { static: false }) editorRef!: ElementRef;
//   private caretRange: Range | null = null;

//   constructor(
//     private http: HttpClient,
//     private aiService: AiService
//   ) { }

//   generateMarketingEmail() {
//     this.showPopup = true;
//     this.emailDraft = '';
//     this.editorContent = '';
//     this.errorMessage = '';

//     const prompt = `צור טיוטה של מייל שיווקי בעברית עבור משתמשים שמכינים לוח שנה אישי עם תמונות לפי תאריך ,באתר MOMENTO. סגנון קליל, מזמין, עם קריאה לפעולה ברורה.`;


//     this.http.post<any>('https://api.openai.com/v1/chat/completions', {
//       model: 'gpt-3.5-turbo',
//       messages: [{ role: 'user', content: prompt }]
//     }, {
//       headers: {
//         'Authorization': `Bearer ${apiKey}`,
//         'Content-Type': 'application/json'
//       }
//     }).subscribe(res => {
//       this.emailDraft = res.choices[0].message.content;

//       const formattedContent = `<div dir="rtl" style="text-align: right;">${this.emailDraft}</div>`;

//       // setTimeout(() => {
//       //   this.editorContent = formattedContent;
//       // }, 100);

//       this.saveCaretPosition();

//       setTimeout(() => {
//         this.editorContent = formattedContent;
//         setTimeout(() => this.restoreCaretPosition(), 50);
//       }, 50);
//     }, err => {
//       console.error(err);
//       this.errorMessage = 'אירעה שגיאה בקבלת הטיוטה';
//     });
//   }

//   sendToAll() {
//     this.sendingProgress = {
//       total: 0,
//       sent: 0,
//       failed: 0
//     };

//     this.isSending = true;

//     this.aiService.getEmails().subscribe({
//       next: emails => {
//         const emailList = Array.isArray(emails) ? emails : [];
//         this.sendingProgress.total = emailList.length;

//         if (emailList.length === 0) {
//           this.isSending = false;
//           this.errorMessage = 'אין כתובות מייל לשליחה';
//           return;
//         }

//         // Process each email
//         emailList.forEach(email => {
//           const emailData = {
//             to: email,
//             subject: 'Test Subject',
//             body: this.editorContent,
//           };
//           console.log(emailData);

//           this.aiService.sendEmail(emailData).subscribe({
//             next: response => {
//               console.log('Email sent successfully!', response);
//               this.sendingProgress.sent++;

//               // Only close popup when all emails are processed
//               if (this.sendingProgress.sent + this.sendingProgress.failed === this.sendingProgress.total) {
//                 this.isSending = false;

//                 // Only close if at least one email was sent successfully
//                 if (this.sendingProgress.sent > 0) {
//                   setTimeout(() => {
//                     this.showPopup = false;
//                   }, 1000); // Show success state briefly before closing
//                 }
//               }
//             },
//             error: error => {
//               console.error('Error sending email:', error);
//               this.sendingProgress.failed++;

//               // Check if all emails are processed
//               if (this.sendingProgress.sent + this.sendingProgress.failed === this.sendingProgress.total) {
//                 this.isSending = false;
//               }
//             }
//           });
//         });
//       },
//       error: error => {
//         console.error('Error getting email list:', error);
//         this.errorMessage = 'אירעה שגיאה בקבלת רשימת המיילים';
//         this.isSending = false;
//       }
//     });
//   }



//   closePopup() {
//     this.showPopup = false;
//     this.emailDraft = '';
//     this.editorContent = '';
//     this.errorMessage = '';
//   }

//   getSendingPercentage(): number {
//     if (this.sendingProgress.total === 0) return 0;
//     return Math.round(
//       ((this.sendingProgress.sent + this.sendingProgress.failed) / this.sendingProgress.total) * 100
//     );
//   }

//   saveCaretPosition() {
//     const selection = window.getSelection();
//     if (selection && selection.rangeCount > 0) {
//       this.caretRange = selection.getRangeAt(0).cloneRange();
//     }
//   }

//   restoreCaretPosition() {
//     if (this.caretRange) {
//       const selection = window.getSelection();
//       if (selection) {
//         selection.removeAllRanges();
//         selection.addRange(this.caretRange);
//       }
//     }
//   }

//   execCommand(command: string, value?: string) {
//     document.execCommand(command, false, value);
//   }
// }


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

        // Process each email
        emailList.forEach(email => {
          const emailData = {
            to: email,
            subject: 'Test Subject',
            body: this.editorContent,
          };
          console.log(emailData);

          this.aiService.sendEmail(emailData).subscribe({
            next: response => {
              console.log('Email sent successfully!', response);
              this.sendingProgress.sent++;

              // Only close popup when all emails are processed
              if (this.sendingProgress.sent + this.sendingProgress.failed === this.sendingProgress.total) {
                this.isSending = false;
                // this.showPopup = false; 
                // this.editorContent = '';
                // this.emailDraft = '';

                // Only close if at least one email was sent successfully
                if (this.sendingProgress.sent > 0) {
                  setTimeout(() => {
                    this.showPopup = false;
                    this.closePopup();
                  }, 1000); // Show success state briefly before closing
                }
              }
            },
            error: error => {
              console.error('Error sending email:', error);
              this.sendingProgress.failed++;

              // Check if all emails are processed
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
    // Don't allow closing while sending
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