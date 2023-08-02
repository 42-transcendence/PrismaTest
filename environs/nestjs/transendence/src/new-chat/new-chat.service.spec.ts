import { Test, TestingModule } from '@nestjs/testing';
import { NewChatService } from './new-chat.service';

describe('NewChatService', () => {
  let service: NewChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewChatService],
    }).compile();

    service = module.get<NewChatService>(NewChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
