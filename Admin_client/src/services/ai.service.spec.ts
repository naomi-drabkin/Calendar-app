import { TestBed } from '@angular/core/testing';
import { AiService } from './ai.service';

// import { AiService } from '../app/ai.service';

describe('AiService', () => {
  let service: AiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
