import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

declare var $;

@Component({
  selector: 'app-photo-uploader',
  templateUrl: './photo-uploader.component.html',
  styleUrls: ['./photo-uploader.component.css']
})
export class PhotoUploaderComponent implements OnInit {

  files: FileList;
  showButton = true;
  @ViewChild('inputContent') input: ElementRef;
  @ViewChild('selectedImage') selectedImage: ElementRef;
  constructor(private el: ElementRef, private cdr: ChangeDetectorRef,private sanitizer: DomSanitizer) { }

  ngOnInit() { }

  getFiles(event: any) {
    const that = this;
    this.files = event.target.files;
    for (let i = 0, f; f = this.files[i]; i++) {
      if (!f.type.match('image.*')) {
        continue;
      }

      let reader = new FileReader();
      reader.onload = (function (theFile) {
        return function (e) {
          that.showButton = false;
          that.selectedImage.nativeElement.src = e.target.result;
        };
      })(f);
      reader.readAsDataURL(f);
    }
  }

  backgroundClick(){ 
    if(!this.showButton){
      $('#files').trigger('click');
    }
  }

  public GetPhoto(){
    return this.files[0];
  }
}

