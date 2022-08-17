import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Dimensions, ImageCroppedEvent, ImageCropperComponent, ImageTransform } from 'ngx-image-cropper';
import { base64ToFile } from 'ngx-image-cropper';
import { MatDialogRef, MAT_DIALOG_DATA, MatSliderChange, MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cropper-modal',
  templateUrl: './cropper-modal.component.html',
  styleUrls: ['./cropper-modal.component.scss'],
})
export class CropperModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogpopup: MatDialogRef<CropperModalComponent>, private router: Router,private snackBar: MatSnackBar, public dialog: MatDialog,) { }

  ngOnInit() {}
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  sliderVal=1;

  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  eventpic:any='';
  flag:any='';
  loading :any=0;
    @ViewChild(ImageCropperComponent, undefined) imageCropper: ImageCropperComponent;
    fileChangeEvent(event: any): void {
      console.log(event);
      this.scale = 1;

      //..............
      this.sliderVal=1;
      this.flag=1;
      if(event.srcElement.value)
        this.imageChangedEvent = event;
      else
         return;  
     
     //2Mb Validation

    //  if(event.srcElement.value)
    //   {
    //     var finalImageSize= Math.round(event.srcElement.files[0].size / 1024);
    //     // console.log(event.srcElement.files[0].size / 1024);
    //     if(finalImageSize > 2048)
    //       {
    //         let snackBarRef1 = this.snackBar.open('File is larger than 2 MB','',{
    //           duration:2000,
    //         });
    //         console.log("size exeeded");
    //         return;
    //        } 
    //        else
    //        {
    //         this.sliderVal=1;
    //         this.flag=1;
    //         this.imageChangedEvent = event;
    //        }
            
    //   }     
    //   else
    //      return;  

  }
  change_button() {
    if (this.flag == 1) {
      this.flag = 1
    } else {
      this.flag = 0
    }
  }
  

  imageCropped(event: ImageCroppedEvent) {
      this.flag = 1;
      console.log(this.flag)
      this.croppedImage = event.base64;
      console.log(this.croppedImage);
     // console.log(event)
      this.eventpic = event;
     // console.log(base64ToFile(event.base64));
  }

  imageLoaded() {
      this.showCropper = true;
      console.log('Image loaded');
     
  }

  croperHeight;

  cropperReady(sourceImageDimensions: Dimensions) {
    this.croperHeight = sourceImageDimensions.height;
      console.log('Cropper ready', sourceImageDimensions);
      this.loading = 0;
      console.log(this.loading)
  }

  loadImageFailed() {
      console.log('Load failed');
  }
  rotateLeft() {
    this.loading = 1;
    console.log(this.loading)
    this.canvasRotation--;
    this.flipAfterRotate();
}

  rotateRight() {
    this.loading = 1;
    this.canvasRotation++;
    this.flipAfterRotate();
}

flipAfterRotate() {
    this.loading = 0;
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
        ...this.transform,
        flipH: flippedV,
        flipV: flippedH
    };

}
  zoomOut() {
    this.scale -= .1;
    console.log(this.scale);
    if(this.scale < 1)
      return;
    this.transform = {
        ...this.transform,
        scale: this.scale
    };
    
}

zoomIn() {
 
    this.scale += .1;
    console.log(this.scale);
    this.transform = {
        ...this.transform,
        scale: this.scale
    };
}
closePopup(val) {
  console.log(val);
  console.log(this.croppedImage);
  if(val == 0)
  {
    this.croppedImage = "";
    console.log(this.croppedImage);  
    this.dialogpopup.close({
         data:this.croppedImage
       });
  }
  else
  {
       //2Mb Validation
       var stringLength = this.croppedImage.length - 'data:image/png;base64,'.length;
       var sizeInBytes = 4 * Math.ceil((stringLength / 3))*0.5624896334383812;
       var sizeInKb = sizeInBytes/1000;
       var sizeInMb = sizeInBytes/(1000 * 1000);
       console.log("Mb:"+sizeInMb)
       console.log("Kb:"+sizeInKb)
       if(sizeInMb < 2048)
       { 
        console.log(this.croppedImage);  
        this.dialogpopup.close({
             data:this.croppedImage
           });

       }
       else
        {
          console.log("Limit Exeed");  
          let snackBarRef1 = this.snackBar.open('File is larger than 2 MB','',{
          duration:2000,
        });
          return;
        }
  }



   }
 onInputChange(event: MatSliderChange) {    
    console.log(event.value);
    console.log(this.sliderVal);
    if(event.value > this.sliderVal)
      this.zoomIn();
    else
      this.zoomOut();
    this.sliderVal=event.value;
  }
}
