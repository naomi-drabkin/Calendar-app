
import { Component, Input, Output, EventEmitter, ViewEncapsulation, AfterViewInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-simple-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="simple-editor-container">
      <div class="toolbar">
        <button type="button" class="toolbar-button" (click)="formatText('bold')" title="מודגש">
          <span style="font-weight: bold;">B</span>
        </button>
        <button type="button" class="toolbar-button" (click)="formatText('italic')" title="נטוי">
          <span style="font-style: italic;">I</span>
        </button>
        <button type="button" class="toolbar-button" (click)="formatText('underline')" title="קו תחתון">
          <span style="text-decoration: underline;">U</span>
        </button>
        
        <div class="toolbar-divider"></div>
        
        <div class="color-picker">
          <button type="button" class="toolbar-button color-button" title="צבע טקסט" (click)="toggleColorPicker('text')">
            <span class="color-icon" [style.background-color]="currentTextColor"></span>
            <span class="color-label">צבע טקסט</span>
          </button>
          <div class="color-palette" *ngIf="showTextColorPicker">
            <div class="color-palette-header">
              <span>בחר צבע טקסט</span>
              <button class="close-palette" (click)="toggleColorPicker('text')">×</button>
            </div>
            <div class="color-grid">
              <button 
                *ngFor="let color of colorPalette" 
                class="color-swatch" 
                [style.background-color]="color"
                (click)="applyTextColor(color)"
                [title]="color"
              ></button>
            </div>
          </div>
        </div>
        
        <div class="color-picker">
          <button type="button" class="toolbar-button color-button" title="צבע רקע" (click)="toggleColorPicker('background')">
            <span class="color-icon" [style.background-color]="currentBgColor"></span>
            <span class="color-label">צבע רקע</span>
          </button>
          <div class="color-palette" *ngIf="showBgColorPicker">
            <div class="color-palette-header">
              <span>בחר צבע רקע</span>
              <button class="close-palette" (click)="toggleColorPicker('background')">×</button>
            </div>
            <div class="color-grid">
              <button 
                *ngFor="let color of colorPalette" 
                class="color-swatch" 
                [style.background-color]="color"
                (click)="applyBgColor(color)"
                [title]="color"
              ></button>
            </div>
          </div>
        </div>
        
        <div class="toolbar-divider"></div>
        
        <div class="dropdown">
          <button type="button" class="toolbar-button dropdown-toggle">
            <span>סגנון</span>
            <span class="dropdown-arrow">▼</span>
          </button>
          <div class="dropdown-menu">
            <button type="button" class="dropdown-item" (click)="formatText('h1')">כותרת 1</button>
            <button type="button" class="dropdown-item" (click)="formatText('h2')">כותרת 2</button>
            <button type="button" class="dropdown-item" (click)="formatText('normal')">טקסט רגיל</button>
          </div>
        </div>
      </div>
      
      <div 
        #editorContent
        class="editor-content" 
        contenteditable="true"
        (input)="onContentChange()"
        (click)="saveSelection()"
        (keyup)="saveSelection()"
        (mouseup)="saveSelection()"
        (focus)="saveSelection()"
        dir="rtl"
      ></div>
    </div>
  `,
  styleUrls: ['./simple-editor.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SimpleEditorComponent implements AfterViewInit {
  @ViewChild('editorContent') editorContentRef!: ElementRef;
  
  @Input() 
  set content(value: string) {
    if (this._content !== value) {
      this._content = value;
      if (this.editorContentRef && this.editorContentRef.nativeElement.innerHTML !== value) {
        this.editorContentRef.nativeElement.innerHTML = value;
      }
    }
  }
  
  get content(): string {
    return this._content;
  }
  
  private _content: string = '';
  
  @Output() contentChange = new EventEmitter<string>();
  
  showTextColorPicker: boolean = false;
  showBgColorPicker: boolean = false;
  currentTextColor: string = '#000000';
  currentBgColor: string = 'transparent';
  
  colorPalette: string[] = [
    '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
    '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
    '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
    '#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b4a7d6', '#d5a6bd',
    '#cc4125', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6d9eeb', '#6fa8dc', '#8e7cc3', '#c27ba0',
    '#a61c00', '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3c78d8', '#3d85c6', '#674ea7', '#a64d79',
    '#85200c', '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#1155cc', '#0b5394', '#351c75', '#741b47',
    '#5b0f00', '#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#1c4587', '#073763', '#20124d', '#4c1130'
  ];
  
  private lastSelection: {
    startOffset: number;
    endOffset: number;
    startContainer: Node | null;
    endContainer: Node | null;
  } | null = null;

  constructor(private ngZone: NgZone) {}
  
  ngAfterViewInit() {
    if (this.content) {
      this.editorContentRef.nativeElement.innerHTML = this.content;
    }
    
    setTimeout(() => {
      this.editorContentRef.nativeElement.focus();
    }, 0);
  }

  onContentChange() {
    this.saveSelection();
    
    const newContent = this.editorContentRef.nativeElement.innerHTML;
    if (this._content !== newContent) {
      this._content = newContent;
      this.contentChange.emit(this._content);
    }
    
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.restoreSelection();
      }, 0);
    });
  }
  
  saveSelection() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      this.lastSelection = {
        startOffset: range.startOffset,
        endOffset: range.endOffset,
        startContainer: range.startContainer,
        endContainer: range.endContainer
      };
    }
  }
  
  restoreSelection() {
    if (!this.lastSelection) return;
    
    const selection = window.getSelection();
    if (!selection) return;
    
    if (!this.isNodeInEditor(this.lastSelection.startContainer) || 
        !this.isNodeInEditor(this.lastSelection.endContainer)) {
      return;
    }
    
    try {
      selection.removeAllRanges();
      const range = document.createRange();
      range.setStart(this.lastSelection.startContainer!, this.lastSelection.startOffset);
      range.setEnd(this.lastSelection.endContainer!, this.lastSelection.endOffset);
      selection.addRange(range);
    } catch (e) {
      console.error('Error restoring selection:', e);
    }
  }
  
  isNodeInEditor(node: Node | null): boolean {
    if (!node) return false;
    return this.editorContentRef.nativeElement.contains(node);
  }

  formatText(format: string) {
    this.editorContentRef.nativeElement.focus();
    this.restoreSelection();
    
    switch (format) {
      case 'bold':
        document.execCommand('bold', false);
        break;
      case 'italic':
        document.execCommand('italic', false);
        break;
      case 'underline':
        document.execCommand('underline', false);
        break;
      case 'h1':
        document.execCommand('formatBlock', false, '<h1>');
        break;
      case 'h2':
        document.execCommand('formatBlock', false, '<h2>');
        break;
      case 'normal':
        document.execCommand('formatBlock', false, '<p>');
        break;
    }
    
    this.saveSelection();
    
    this._content = this.editorContentRef.nativeElement.innerHTML;
    this.contentChange.emit(this._content);
  }
  
  toggleColorPicker(type: 'text' | 'background') {
    if (type === 'text') {
      this.showTextColorPicker = !this.showTextColorPicker;
      this.showBgColorPicker = false;
    } else {
      this.showBgColorPicker = !this.showBgColorPicker;
      this.showTextColorPicker = false;
    }
  }
  
  applyTextColor(color: string) {
    this.currentTextColor = color;
    this.editorContentRef.nativeElement.focus();
    this.restoreSelection();
    document.execCommand('foreColor', false, color);
    this.saveSelection();
    this.showTextColorPicker = false;
    
    this._content = this.editorContentRef.nativeElement.innerHTML;
    this.contentChange.emit(this._content);
  }
  
  applyBgColor(color: string) {
    this.currentBgColor = color;
    this.editorContentRef.nativeElement.focus();
    this.restoreSelection();
    
    try {
      document.execCommand('hiliteColor', false, color);
      
      if (!this.isBackgroundColorApplied()) {
        this.applyBackgroundColorManually(color);
      }
    } catch (e) {
      this.applyBackgroundColorManually(color);
    }
    
    this.saveSelection();
    this.showBgColorPicker = false;
    
    this._content = this.editorContentRef.nativeElement.innerHTML;
    this.contentChange.emit(this._content);
  }
  
  isBackgroundColorApplied(): boolean {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;
    
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    range.surroundContents(span);
    
    const result = span.style.backgroundColor !== '';
    
    if (!result) {
      const parent = span.parentNode;
      while (span.firstChild) {
        parent?.insertBefore(span.firstChild, span);
      }
      parent?.removeChild(span);
    }
    
    return result;
  }
  
  applyBackgroundColorManually(color: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.backgroundColor = color;
    
    try {
      range.surroundContents(span);
    } catch (e) {
      console.error('Error applying background color:', e);
            const fragment = range.extractContents();
      span.appendChild(fragment);
      range.insertNode(span);
    }
  }
}