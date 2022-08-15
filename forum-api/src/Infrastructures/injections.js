/* istanbul ignore file */

// external agency
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool');

// service (repository, helper, manager, etc)
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const BcryptEncryptionHelper = require('./security/BcryptEncryptionHelper');
const JwtTokenManager = require('./security/JwtTokenManager');
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('./repository/CommentRepositoryPostgres');

// use case
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');
const LoginUserUseCase = require('../Applications/use_case/LoginUserUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase');
const LogoutUserUseCase = require('../Applications/use_case/LogoutUserUseCase');
const AddThreadUseCase = require('../Applications/use_case/AddThreadUseCase');
const ThreadDetailUseCase = require('../Applications/use_case/ThreadDetailUseCase');
const AddCommentUseCase = require('../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../Applications/use_case/DeleteCommentUseCase');

const serviceInstanceContainer = {
  userRepository: new UserRepositoryPostgres(pool, nanoid),
  authenticationRepository: new AuthenticationRepositoryPostgres(pool),
  encryptionHelper: new BcryptEncryptionHelper(bcrypt),
  authenticationTokenManager: new JwtTokenManager(Jwt.token),
  threadRepository: new ThreadRepositoryPostgres(pool, nanoid),
  commentRepository: new CommentRepositoryPostgres(pool, nanoid),
};

const useCaseInstanceContainer = {
  addUserUseCase: new AddUserUseCase({
    userRepository: serviceInstanceContainer.userRepository,
    encryptionHelper: serviceInstanceContainer.encryptionHelper,
  }),
  loginUserUseCase: new LoginUserUseCase({
    authenticationRepository: serviceInstanceContainer.authenticationRepository,
    authenticationTokenManager: serviceInstanceContainer.authenticationTokenManager,
    userRepository: serviceInstanceContainer.userRepository,
    encryptionHelper: serviceInstanceContainer.encryptionHelper,
  }),
  refreshAuthenticationUseCase: new RefreshAuthenticationUseCase({
    authenticationRepository: serviceInstanceContainer.authenticationRepository,
    authenticationTokenManager: serviceInstanceContainer.authenticationTokenManager,
  }),
  logoutUserUseCase: new LogoutUserUseCase({
    authenticationRepository: serviceInstanceContainer.authenticationRepository,
  }),
  addThreadUseCase: new AddThreadUseCase({
    threadRepository: serviceInstanceContainer.threadRepository,
  }),
  threadDetailUseCase: new ThreadDetailUseCase({
    commentRepository: serviceInstanceContainer.commentRepository,
    threadRepository: serviceInstanceContainer.threadRepository,
  }),
  addCommentUseCase: new AddCommentUseCase({
    commentRepository: serviceInstanceContainer.commentRepository,
    threadRepository: serviceInstanceContainer.threadRepository,
  }),
  deleteCommentUseCase: new DeleteCommentUseCase({
    commentRepository: serviceInstanceContainer.commentRepository,
  }),
};

// export all instance
module.exports = {
  ...serviceInstanceContainer,
  ...useCaseInstanceContainer,
};
