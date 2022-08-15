const createServer = require('../src/Infrastructures/http/createServer');
const injections = require('../src/Infrastructures/injections');

const UserLoginTestHelper = {
  async getAccessToken() {
    // Arrange
    const requestPayload = {
      username: 'userlogintest',
      password: 'secret',
    };
    const server = await createServer(injections);
    // add user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'userlogintest',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: requestPayload,
    });

    const responseJson = JSON.parse(response.payload);
    return responseJson.data.accessToken;
  },
};

module.exports = UserLoginTestHelper;
