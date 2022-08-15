class NewComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content } = payload;

    this.content = content;
  }

  _verifyPayload({ content }) {
    if (!content) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (content.length > 255) {
      throw new Error('NEW_COMMENT.CONTENT_LIMIT_CHAR');
    }
  }
}

module.exports = NewComment;
