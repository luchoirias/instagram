import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import FirebaseContext from '../../context/firebase';
import UserContext from '../../context/user';

const AddComment = ({
  docId, comments, setComments, commentInput
}) => {
  const { firebase, FieldValue } = useContext(FirebaseContext);
  const {
    user: {
      displayName
    }
  } = useContext(UserContext);

  const [comment, setComment] = useState('');

  // Function to add the comment to firebase
  const saveComment = async (newComment) => {
    const db = firebase.firestore();

    await db
      .collection('photos')
      .doc(docId)
      .update({
        comments: FieldValue.arrayUnion(newComment)
      });
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();

    setComments([
      {
        displayName,
        comment
      },
      ...comments
    ]);

    saveComment({
      displayName,
      comment
    });
  };

  return (
    <div className="border-t border-gray-primary mt-1">
      <form
        className="flex justify-between pl-0 pr-5"
        method="POST"
        onSubmit={(e) => (
          comment.length >= 1 ? handleSubmitComment() : e.preventDefault()
        )}
      >
        <input
          aria-label="Add a comment"
          autoComplete="off"
          type="text"
          name="comment"
          className="text-sm text-gray-base w-full mr-3 py-5 px-4 select-none"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          ref={commentInput}
        />
        <button
          className={`text-sm font-bold text-blue-medium ${!comment && 'opacity-25'}`}
          type="button"
          disabled={comment.length < 1}
          onClick={handleSubmitComment}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmitComment();
            }
          }}
        >
          Post
        </button>
      </form>
    </div>
  );
};

AddComment.propTypes = {
  docId: PropTypes.string.isRequired,
  comments: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setComments: PropTypes.func.isRequired,
  commentInput: PropTypes.shape({}).isRequired
};

export default AddComment;
