import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements AfterViewInit {
  @ViewChild('pdfContainer', { static: true }) pdfContainer!: ElementRef;

  ngAfterViewInit() {
    const url = 'http://localhost:8080/api/pv/2/view';

    const loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then((pdf) => {
      pdf.getPage(1).then((page) => {
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        this.pdfContainer.nativeElement.appendChild(canvas);

        const renderContext = { canvasContext: context, viewport: viewport };
        page.render(renderContext);
      });
    });
  }
}