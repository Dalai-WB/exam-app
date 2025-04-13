import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BodyComponent } from './components/body/body.component';
import { CardComponent } from './components/card/card.component';
import { DetailComponent } from './components/detail/detail.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { StepperModule } from 'primeng/stepper';
import { HttpClientModule } from '@angular/common/http';
import { MathJaxParagraphComponent } from './components/math-jax-paragraph/math-jax-paragraph.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BadgeModule } from 'primeng/badge';
import { FileUploadModule } from 'primeng/fileupload';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { ExamCreateComponent } from './components/exam-create/exam-create.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SplitterModule } from 'primeng/splitter';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DialogModule } from 'primeng/dialog';
import { StatisticComponent } from './components/statistic/statistic.component';
import { ChartModule } from 'primeng/chart';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RequestComponent } from './components/request/request.component';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    CardComponent,
    DetailComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    SidebarComponent,
    MathJaxParagraphComponent,
    SafeHtmlPipe,
    ExamCreateComponent,
    StatisticComponent,
    RequestComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    StepperModule,
    HttpClientModule,
    ToastModule,
    BrowserAnimationsModule,
    BadgeModule,
    ReactiveFormsModule,
    FileUploadModule,
    InputTextModule,
    InputNumberModule,
    AccordionModule,
    ButtonModule,
    RadioButtonModule,
    DropdownModule,
    SplitterModule,
    ScrollPanelModule,
    DialogModule,
    ChartModule,
    SelectButtonModule,
    TableModule,
    TooltipModule,
    ProgressSpinnerModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
  ],
  providers: [
    MessageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
