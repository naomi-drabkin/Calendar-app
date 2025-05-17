import { Routes } from '@angular/router';
import { AuthComponent } from '../components/auth/auth.component';
import { UsersComponent } from '../components/users/users.component';
import { AuthGuard } from '../guards/auth.guard';
import { AiReportComponent } from '../components/ai-report/ai-report.component';
import { UploadTemplatesComponent } from '../components/upload-templates/upload-templates.component';
// import { AiReportComponent } from '../components/ai-report/ai-report.component';

export const routes: Routes = [
    { path: 'login', component: AuthComponent},
    { path: 'users', component: UsersComponent , canActivate: [AuthGuard] },
    { path: 'sendEmails', component: AiReportComponent },
    { path: 'templates', component: UploadTemplatesComponent },

];
