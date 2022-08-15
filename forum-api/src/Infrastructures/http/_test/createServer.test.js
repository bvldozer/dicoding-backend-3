const createServer = require('../createServer');
const injections = require('../../injections');
const UserLoginTestHelper = require('../../../../tests/UserLoginTestHelper');

describe('HTTP server', () => {
  it('should response 404 when request unregistered route', async () => {
    // Arrange
    const server = await createServer({});

    // Action
    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute',
    });

    // Assert
    expect(response.statusCode).toEqual(404);
  });

  it('should handle server error correctly', async () => {
    // Arrange
    const requestPayload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'super_secret',
    };
    const server = await createServer({}); // fake injection

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual('error');
    expect(responseJson.message).toEqual('terjadi kegagalan pada server kami');
  });

  it('should throw 401 error', async () => {
    // Arrange
    const requestPayload = {
      title: 'dicoding',
      body: 'Dicoding Indonesia',
    };
    const server = await createServer(injections);

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: requestPayload,
    });

    // Assert
    expect(response.statusCode).toEqual(401);
  });

  it('should return 201 after put token', async () => {
    // Arrange
    const requestPayload = {
      title: 'dicoding',
      body: 'Dicoding Indonesia',
    };
    const server = await createServer(injections);
    const accessToken = await UserLoginTestHelper.getAccessToken();

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: requestPayload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Assert
    expect(response.statusCode).toEqual(201);
  });
});
