import React, { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { Button, Icon, Label, Popup } from "semantic-ui-react";

function LikeButton({ post: { id, likeCount, likes }, user }) {
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    if (
      user &&
      likes.find(
        (like) => like.username === (user.username || user._doc.username)
      )
    ) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST, {
    variables: {
      postId: id,
    },
  });

  const likeButton = user ? (
    liked ? (
      <Button color="red">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="red" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="red" basic>
      <Icon name="heart" />
    </Button>
  );
  return (
    <Popup
      content="Like the Post"
      inverted
      trigger={
        <Button as="div" labelPosition="right" onClick={likePost}>
          {likeButton}
          <Label as="a" basic color="red" pointing="left">
            {likeCount}
          </Label>
        </Button>
      }
    />
  );
}

const LIKE_POST = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;
