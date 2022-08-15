class ThreadDetailUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    const comments = await this._commentRepository.getCommentByThreadId(threadId);
    const threadDetail = await this._threadRepository.getThreadById(threadId);
    threadDetail.comments = comments;

    return threadDetail;
  }
}

module.exports = ThreadDetailUseCase;
