import { Repository } from "typeorm";

export const repositoryMockFactory: () => Repository<any> = jest.fn(() => {
    const original = jest.requireActual("typeorm");
    return {
        ...original,
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
        update: jest.fn(),
        remove: jest.fn()
    }
});