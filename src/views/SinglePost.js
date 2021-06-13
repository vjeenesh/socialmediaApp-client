import React, { useContext, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { AuthContext } from "../context/auth";
import {
  Card,
  Grid,
  Image,
  Comment,
  Loader,
  Button,
  Header,
  Icon,
  Form,
  Label,
} from "semantic-ui-react";
import moment from "moment";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";
import { Link } from "react-router-dom";
moment().format();

function SinglePost(props) {
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState("");
  const postId = props.match.params.postId;
  const { loading, data: { getPost } = {} } = useQuery(GET_POST, {
    variables: {
      postId,
    },
  });
  const [createComment] = useMutation(CREATE_COMMENT, {
    update() {
      setComment("");
    },
    variables: {
      postId,
      body: comment,
    },
  });
  function deletePostCallback() {
    props.history.push("/");
  }
  let postMarkup;
  if (loading) {
    return (
      <Loader active inline="centered">
        Loading Post...
      </Loader>
    );
  }
  if (getPost) {
    const {
      id,
      username,
      body,
      likeCount,
      commentCount,
      comments,
      likes,
      createdAt,
    } = getPost;
    postMarkup = (
      <Grid stackable doubling columns={2}>
        <Grid.Row centered>
          <Grid.Column width={2}>
            <Image
              centered
              size="small"
              src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header as={Link} to={`/user/${username}`}>
                  {username}
                </Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>

              <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likeCount }} />
                <Button labelPosition="right" as="div">
                  <Button color="blue" basic>
                    <Icon name="comment" />
                  </Button>
                  <Label basic color="blue" pointing="left">
                    {commentCount}
                  </Label>
                </Button>
                {user && (user.username || user._doc.username) === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            <Comment.Group>
              <Header as="h3" dividing>
                {comments.length > 0
                  ? "Comments"
                  : "Be the first one to comment!"}
              </Header>
              {user && (
                <Form reply style={{ marginBottom: 10 }}>
                  <Form.TextArea
                    name="comment"
                    placeholder="Comment..."
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                  />
                  <Button
                    content="Add Comment"
                    labelPosition="left"
                    icon="edit"
                    disabled={comment.trim() === ""}
                    onClick={createComment}
                    primary
                  />
                </Form>
              )}

              {comments.length > 0 &&
                comments.map((comment) => {
                  return (
                    <Comment style={{ marginTop: 5 }} key={comment.id}>
                      <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/matt.jpg" />
                      <Comment.Actions>
                        {user &&
                          (user.username || user._doc.username) ===
                            comment.username && (
                            <DeleteButton postId={id} commentId={comment.id} />
                          )}
                      </Comment.Actions>
                      <Comment.Content>
                        <Comment.Author
                          as={Link}
                          to={`/user/${comment.username}`}
                        >
                          @{comment.username}
                        </Comment.Author>
                        <Comment.Metadata>
                          <div>{moment(comment.createdAt).fromNow()}</div>
                        </Comment.Metadata>
                        <Comment.Text>{comment.body}</Comment.Text>
                      </Comment.Content>
                    </Comment>
                  );
                })}
            </Comment.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
}

const GET_POST = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
      id
      username
      body
      createdAt
      likeCount
      commentCount
      comments {
        id
        body
        username
        createdAt
      }
      likes {
        id
        username
      }
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        username
        body
        createdAt
      }
      commentCount
      body
      username
      createdAt
    }
  }
`;

export default SinglePost;
