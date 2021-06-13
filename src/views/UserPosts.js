import { useQuery } from "@apollo/client";
import React, { useContext } from "react";
import { Loader, Grid, Transition, Header, Image } from "semantic-ui-react";
import PostCard from "../components/PostCard";

import { GET_POSTS_QUERY } from "../utils/graphql";

function UserPosts(props) {
  const username = props.match.params.username;
  const {
    loading,
    error,
    data: { getPosts: posts } = {},
  } = useQuery(GET_POSTS_QUERY);

  if (error) {
    return `Oops! Error: ${error.message}`;
  }
  if (loading) {
    return (
      <Loader active inline="centered">
        Loading User...
      </Loader>
    );
  }
  if (posts) {
    const userPosts = posts.filter((post) => post.username === username);
    return (
      <Grid stackable doubling columns={3} divided>
        <Grid.Row>
          <Header floated="left" as="h2" style={{ marginTop: 5 }}>
            <Image
              circular
              src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
            />{" "}
            {username}
          </Header>
        </Grid.Row>
        <Grid.Row>
          {posts && loading ? (
            <Loader active inline="centered">
              Loading Posts...
            </Loader>
          ) : (
            <Transition.Group>
              {userPosts.map((post) => {
                return (
                  <Grid.Column style={{ marginBottom: 20 }} key={post.id}>
                    <PostCard post={post} />
                  </Grid.Column>
                );
              })}
            </Transition.Group>
          )}
        </Grid.Row>
      </Grid>
    );
  }
}

export default UserPosts;
