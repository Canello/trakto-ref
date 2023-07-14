import { Test, TestingModule } from '@nestjs/testing';
import { BlurService } from './blur.service';

describe('BlurService', () => {
  let service: BlurService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlurService],
    }).compile();

    service = module.get<BlurService>(BlurService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
