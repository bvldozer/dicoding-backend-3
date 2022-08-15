class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(commentId, owner) {
    await this._commentRepository.verifyCommentOwner(commentId, owner);
    return this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
