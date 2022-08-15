const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  it('should be instance of ThreadRepository domain', () => {
    const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {});

    expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await UsersTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addThread function', () => {
      it('should persist new thread and return thread correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({
          id: 'user-123', username: 'user add thread', password: 'secret', fullname: 'Dicoding Indonesia',
        });

        const newThread = new NewThread({
          title: 'add thread',
          body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
        });
        const owner = 'user-123';

        const fakeIdGenerator = () => '123'; // stub!
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

        // Action
        const addedThread = await threadRepositoryPostgres.addThread(newThread, owner);

        // Assert
        const thread = await ThreadsTableTestHelper.findThreadById('thread-123');

        expect(addedThread).toStrictEqual(new AddedThread({
          id: 'thread-123',
          title: 'add thread',
          owner: 'user-123',
        }));
        expect(thread).toHaveLength(1);
      });
    });

    describe('getThreadById', () => {
      it('should throw NotFoundError when thread not found', async () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        // Action & Assert
        await expect(threadRepositoryPostgres.getThreadById('thread-111'))
          .rejects
          .toThrowError(NotFoundError);
      });

      it('should return thread id correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({
          id: 'user-123', username: 'user get thread', password: 'secret', fullname: 'Dicoding Indonesia',
        });
        await ThreadsTableTestHelper.addThread(
          {
            id: 'thread-123', title: 'belajar backend', body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit', owner: 'user-123',
          },
        );
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        // Action
        const thread = await threadRepositoryPostgres.getThreadById('thread-123');

        // Assert
        expect(thread.id).toEqual('thread-123');
      });
    });
  });
});
