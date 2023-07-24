import { Test, TestingModule } from '@nestjs/testing';
import { NoneUserService } from './none-user.service';

describe('NoneUserService', () => {
  let service: NoneUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoneUserService],
    }).compile();

    service = module.get<NoneUserService>(NoneUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
