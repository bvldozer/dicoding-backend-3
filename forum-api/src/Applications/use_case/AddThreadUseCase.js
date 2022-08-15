const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, owner) {
    const newThread = new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    });
    return this._threadRepository.addThread(newThread, owner);
  }
}

module.exports = AddThreadUseCase;
