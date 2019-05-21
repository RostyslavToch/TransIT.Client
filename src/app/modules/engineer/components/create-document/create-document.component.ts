import { Component, OnInit, ElementRef, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { IssuelogService } from '../../services/issuelog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IssueLog } from 'src/app/modules/shared/models/issuelog';
import { Document } from '../../models/document';

@Component({
  selector: 'app-add-document',
  templateUrl: './create-document.component.html',
  styleUrls: ['./create-document.component.scss']
})
export class CreateDocumentComponent implements OnInit {

  @ViewChild('close') closeDiv: ElementRef;
  @Output() createDocument = new EventEmitter<Document>();
  @Output() addExistingDocument = new EventEmitter<Document>();
  @Input() issueLog;
  documentForm: FormGroup;
  issueLogList: IssueLog[];

  constructor(
    private serviceIssueLog: IssuelogService,
    private formBuilder: FormBuilder,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    $('#createDocument').on('hidden.bs.modal', function() {
      $(this)
        .find('form')
        .trigger('reset');
    });
    this.documentForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.serviceIssueLog.getEntities().subscribe(issuelog => {
      this.issueLogList = issuelog;
    });
  }

  selectExisting(document: Document): void {
    this.addExistingDocument.emit(document);
    this.closeDiv.nativeElement.click();
    this.toast.success('', 'Документ додано');
  }

  clickSubmit() {
    if (this.documentForm.invalid) {
      return;
    }
    const form = this.documentForm.value;
    const document = new Document({
      name: form.name,
      description: form.description,
      issueLog: this.issueLog
    });

    this.createDocument.emit(document);
    this.closeDiv.nativeElement.click();
    this.toast.success('', 'Документ створено');
  }
}
