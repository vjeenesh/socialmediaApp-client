import React, { useContext } from "react";
import { Button, Card, Image, Icon, Label, Popup } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";

import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";

moment().format();

const PostCard = ({
  post: { id, body, username, createdAt, commentCount, likeCount, likes },
}) => {
  const { user } = useContext(AuthContext);
  // console.log(user);
  return (
    <Card fluid>
      <Card.Content style={{ boxShadow: 0 }}>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
        />
        <Card.Header as={Link} to={`/user/${username}`}>
          {username}
        </Card.Header>
        <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton post={{ id, likeCount, likes }} user={user} />
        <Popup
          content="Leave a comment on post!"
          inverted
          trigger={
            <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
              <Button color="blue" basic>
                <Icon name="comment" />
              </Button>
              <Label basic color="blue" pointing="left">
                {commentCount}
              </Label>
            </Button>
          }
        />
        {user && (user.username || user._doc.username) === username && (
          <DeleteButton postId={id} />
        )}
      </Card.Content>
    </Card>
  );
};

export default PostCard;
