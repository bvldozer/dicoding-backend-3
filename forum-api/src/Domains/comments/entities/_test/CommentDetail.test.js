const CommentDetail = require('../CommentDetail');

describe('a CommentDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'belajar backend',
      username: 'dicoding',
    };

    // Action and Assert
    expect(() => new CommentDetail(payload)).toThrowError('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: {},
      date: 123,
      content: true,
      isDeleted: 123,
    };

    // Action and Assert
    expect(() => new CommentDetail(payload)).toThrowError('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create commentDetail object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'belajar backend',
      date: new Date().toISOString(),
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      isDeleted: false,
    };

    // Action
    const commentDetail = new CommentDetail(payload);

    // Assert
    expect(commentDetail.id).toEqual(payload.id);
    expect(commentDetail.username).toEqual(payload.username);
    expect(commentDetail.date).toEqual(payload.date);
    expect(commentDetail.content).toEqual(payload.content);
  });

  it('should create deleted commentDetail object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'belajar backend',
      date: new Date().toISOString(),
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      isDeleted: true,
    };

    // Action
    const commentDetail = new CommentDetail(payload);

    // Assert
    expect(commentDetail.id).toEqual(payload.id);
    expect(commentDetail.username).toEqual(payload.username);
    expect(commentDetail.date).toEqual(payload.date);
    expect(commentDetail.content).toEqual('**komentar telah dihapus**');
  });
});
