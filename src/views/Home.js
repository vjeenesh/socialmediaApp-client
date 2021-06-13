import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { Grid, Loader, Transition } from "semantic-ui-react";

import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { AuthContext } from "../context/auth";
import { GET_POSTS_QUERY } from "../utils/graphql";

export default function Home() {
  const { user } = useContext(AuthContext);

  const {
    loading,
    error,
    data: { getPosts: posts } = {},
  } = useQuery(GET_POSTS_QUERY);
  if (error) return `Oops! Error: ${error.message}`;
  if (loading)
    return (
      <Loader active inline="centered">
        Loading Posts...
      </Loader>
    );

  if (posts) {
    // console.log(data);
    // console.log("-------------");
    // console.dir(data.getPosts);
    return (
      <Grid stackable doubling columns={3} divided>
        <Grid.Row centered>
          <h1>Recent Posts</h1>
        </Grid.Row>
        <Grid.Row>
          {user && (
            <Grid.Column>
              <PostForm />
            </Grid.Column>
          )}

          {posts && loading ? (
            <Loader active inline="centered">
              Loading Posts...
            </Loader>
          ) : (
            <Transition.Group>
              {posts.map((post) => {
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
