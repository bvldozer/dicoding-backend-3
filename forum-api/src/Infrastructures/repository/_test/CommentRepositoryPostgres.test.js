const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  it('should be instance of CommentRepository domain', () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {});

    expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await UsersTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addComment function', () => {
      it('should persist new thread and return thread correctly', async () => {
        // Arrange
        const fakeIdGenerator = () => '123'; // stub!
        await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
        const owner = 'user-123';

        // Arrange Thread
        const newThread = new NewThread({
          title: 'add thread',
          body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
        });
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

        // Arrange Comment
        const newComment = new NewComment({
          content: 'komentar pedas',
        });
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        // Action
        const addedThread = await threadRepositoryPostgres.addThread(newThread, owner);
        const addedComment = await commentRepositoryPostgres
          .addComment(addedThread.id, newComment, owner);

        // Assert
        const comment = await CommentsTableTestHelper.findCommentById('comment-123');

        expect(addedComment).toStrictEqual(new AddedComment({
          id: 'comment-123',
          content: 'komentar pedas',
          owner,
        }));
        expect(comment).toHaveLength(1);
      });
    });

    describe('getCommentByThreadId', () => {
      it('should return comments with different user correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-a', username: 'user-a' });
        await UsersTableTestHelper.addUser({ id: 'user-b', username: 'user-b' });
        await ThreadsTableTestHelper.addThread(
          {
            id: 'thread-123', title: 'belajar backend', body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit', owner: 'user-a',
          },
        );
        await CommentsTableTestHelper.addComment(
          { id: 'comment-123', threadId: 'thread-123', content: 'tambah komentar user a' }, 'user-a',
        );
        await CommentsTableTestHelper.addComment(
          { id: 'comment-124', threadId: 'thread-123', content: 'tambah komentar user b' }, 'user-b',
        );
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

        // Action
        const comment = await commentRepositoryPostgres.getCommentByThreadId('thread-123');

        // Assert
        expect(comment).toHaveLength(2);
        expect(comment[0].id).toStrictEqual('comment-123');
        expect(comment[0].username).toStrictEqual('user-a');
        expect(comment[0].content).toStrictEqual('tambah komentar user a');
        expect(comment[1].id).toStrictEqual('comment-124');
        expect(comment[1].username).toStrictEqual('user-b');
        expect(comment[1].content).toStrictEqual('tambah komentar user b');
      });
    });

    describe('deleteCommentById', () => {
      it('should throw NotFound when comment not found', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

        // Action & Assert
        await expect(commentRepositoryPostgres.deleteCommentById('comment-111'))
          .rejects
          .toThrowError(new NotFoundError('Komentar gagal dihapus. Id tidak ditemukan'));
      });
    });

    describe('verifyCommentOwner', () => {
      it('should throw NotFound when comment not found', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

        // Action & Assert
        await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
          .rejects
          .toThrowError(new NotFoundError('Komentar tidak ditemukan'));
      });

      it('should return AuthorizationError', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
        await ThreadsTableTestHelper.addThread(
          {
            id: 'thread-123', title: 'belajar backend', body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit', owner: 'user-123',
          },
        );
        await CommentsTableTestHelper.addComment(
          { id: 'comment-123', content: 'tambah komentar' }, 'user-123',
        );
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

        // Action & Assert
        await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-111'))
          .rejects
          .toThrowError(new AuthorizationError('Anda tidak berhak mengakses resource ini'));
      });
    });
  });
});
