import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QueueClassSlotListComponent } from './queue-class-slot-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MemoizedSelector } from '@ngrx/store';
import { mySlot } from '../queue.selectors';
import { MockComponent } from 'ng-mocks';
import { QueueSlotContainerComponent } from '../queue-slot-container/queue-slot-container.component';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';

describe('QueueClassSlotListComponent', () => {
  let component: QueueClassSlotListComponent;
  let fixture: ComponentFixture<QueueClassSlotListComponent>;
  let store: MockStore;
  let mySlotSelector: MemoizedSelector<unknown, any>;

  const initialState = {
    queue: {
      slots: [
        {
          id: 0,
          gameClass: 'scout',
          playerId: null,
          ready: false,
        },
        {
          id: 8,
          gameClass: 'demoman',
          playerId: 'FAKE_PLAYER_ID',
          ready: false,
        },
      ],
    },
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          QueueClassSlotListComponent,
          MockComponent(QueueSlotContainerComponent),
        ],
        providers: [provideMockStore({ initialState })],
      })
        // https://github.com/angular/angular/issues/12313
        .overrideComponent(QueueClassSlotListComponent, {
          set: { changeDetection: ChangeDetectionStrategy.Default },
        })
        .compileComponents();
    }),
  );

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    mySlotSelector = store.overrideSelector(mySlot, null);
    fixture = TestBed.createComponent(QueueClassSlotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with slots', () => {
    beforeEach(() => {
      component.gameClass = 'demoman';
      fixture.detectChanges();
    });

    it('should fetch slots of the given class', () => {
      component.slots.subscribe(slots =>
        expect(slots).toEqual([
          {
            id: 8,
            gameClass: 'demoman',
            playerId: 'FAKE_PLAYER_ID',
            ready: false,
          },
        ]),
      );
    });

    it('should render slots', () => {
      const container = fixture.debugElement.query(
        By.css('app-queue-slot-container'),
      ).componentInstance as QueueSlotContainerComponent;
      expect(container.slotId).toEqual(8);
    });
  });
});
