import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RoomViewPage } from './room-view.page';

describe('RoomViewPage', () => {
  let component: RoomViewPage;
  let fixture: ComponentFixture<RoomViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RoomViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
