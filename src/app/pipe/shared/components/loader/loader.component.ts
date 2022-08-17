import { Component, OnInit, Input, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { OverlayService } from 'src/app/services/overlay.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {

  ngOnInit() {}
  
}
