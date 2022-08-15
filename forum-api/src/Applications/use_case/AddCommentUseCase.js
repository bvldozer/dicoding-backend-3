const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, threadId, owner) {
    await this._threadRepository.getThreadById(threadId);
    const newComment = new NewComment({
      content: useCasePayload.content,
    });
    return this._commentRepository.addComment(threadId, newComment, owner);
  }
}

module.exports = AddCommentUseCase;
