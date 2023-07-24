import { Test, TestingModule } from '@nestjs/testing';
import { NoneUserController } from './none-user.controller';

describe('NoneUserController', () => {
  let controller: NoneUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoneUserController],
    }).compile();

    controller = module.get<NoneUserController>(NoneUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
