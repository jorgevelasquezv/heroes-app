import { Component } from '@angular/core';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: ``,
})
export class LayoutPageComponent {
  public sidebarItems = [
    { label: 'List', path: './list', icon: 'label' },
    { label: 'New', path: './new-hero', icon: 'add' },
    { label: 'Search', path: './search', icon: 'search' },
  ];
}
