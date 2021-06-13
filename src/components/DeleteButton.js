import React, { useState } from "react";
import { Button, Icon, Confirm, Popup } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";

import { GET_POSTS_QUERY } from "../utils/graphql";

function DeleteButton({ postId, callback, commentId }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const mutation = commentId ? DELETE_COMMENT : DELETE_POST;
  const [deleteMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirmDelete(false);
      if (!commentId) {
        const data = proxy.readQuery({
          query: GET_POSTS_QUERY,
          variables: { postId },
        });
        // console.log("Data", data);
        // console.log("Proxy/Cache", proxy);
        if (data) {
          // console.log(data);
          let newData = [...data.getPosts];
          newData = newData.filter((p) => p.id !== postId);
          // console.log("New Data", newData);

          proxy.writeQuery({
            query: GET_POSTS_QUERY,
            variables: { postId },
            data: {
              ...data,
              getPosts: {
                newData,
              },
            },
          });
        }
      }
      if (callback) callback();
    },
    variables: {
      postId,
      commentId,
    },
  });
  return (
    <>
      <Popup
        content={commentId ? "Delete Comment" : "Delete Post"}
        inverted
        trigger={
          <Button
            as="div"
            color="red"
            floated="right"
            onClick={() => setConfirmDelete(true)}
          >
            <Icon style={{ margin: 0 }} name="trash"></Icon>
          </Button>
        }
      />
      <Confirm
        open={confirmDelete}
        header={commentId ? "Delete Comment?" : "Delete Post?"}
        content={
          commentId
            ? "Deleting the comment will permanently erase it"
            : "Deleting the post will permanently erase it"
        }
        cancelButton="Go Back"
        confirmButton={commentId ? "Delete Comment" : "Delete Post"}
        onConfirm={deleteMutation}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}

const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        body
        createdAt
      }
      commentCount
    }
  }
`;

export default DeleteButton;
