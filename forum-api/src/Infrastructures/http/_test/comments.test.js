const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const injections = require('../../injections');
const createServer = require('../createServer');

describe('/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const owner = 'user-123';
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia',
      });
      await ThreadsTableTestHelper.addThread(
        {
          id: 'thread-123', title: 'belajar backend', body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit', owner: 'user-123',
        },
      );

      const requestPayload = {
        content: 'post comment test server',
      };

      // Action
      const server = await createServer(injections);
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: owner,
          },
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const owner = 'user-123';
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia',
      });
      await ThreadsTableTestHelper.addThread(
        {
          id: 'thread-123', title: 'belajar backend', body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit', owner: 'user-123',
        },
      );

      const requestPayload = {
      };

      // Action
      const server = await createServer(injections);
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: owner,
          },
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena terdapat parameter yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const owner = 'user-123';
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia',
      });
      await ThreadsTableTestHelper.addThread(
        {
          id: 'thread-123', title: 'belajar backend', body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit', owner: 'user-123',
        },
      );

      const requestPayload = {
        content: 123,
      };

      // Action
      const server = await createServer(injections);
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: owner,
          },
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai');
    });

    it('should response 400 when title more than 255 character', async () => {
      // Arrange
      const owner = 'user-123';
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia',
      });
      await ThreadsTableTestHelper.addThread(
        {
          id: 'thread-123', title: 'belajar backend', body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit', owner: 'user-123',
        },
      );

      const requestPayload = {
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      };

      // Action
      const server = await createServer(injections);
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: owner,
          },
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena karakter content melebihi batas limit');
    });
  });

  describe('when DELETE /threads/thread-123/comments/comment-123', () => {
    it('should response 200 OK', async () => {
      // Arrange
      const owner = 'user-123';
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia',
      });
      await ThreadsTableTestHelper.addThread(
        {
          id: 'thread-123', title: 'belajar backend', body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit', owner: 'user-123',
        },
      );
      await CommentsTableTestHelper.addComment(
        { id: 'comment-123', content: 'tambah komentar' }, 'user-123',
      );

      // Action
      const server = await createServer(injections);
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: owner,
          },
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
