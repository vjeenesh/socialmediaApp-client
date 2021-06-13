import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/client";

import { useForm } from "../utils/hooks";
import { GET_POSTS_QUERY, CREATE_POST } from "../utils/graphql";

function PostForm() {
  const [errors, setErrors] = useState("");
  const { values, onSubmit, onChange } = useForm(createPostCallback, {
    body: "",
  });
  const [createPost] = useMutation(CREATE_POST, {
    variables: values,
    errorPolicy: "all",
    update(proxy, result) {
      const data = proxy.readQuery({
        query: GET_POSTS_QUERY,
        variables: values,
      });
      if (data) {
        let newData = [...data.getPosts];
        newData.getPosts = [result.data.createPost, ...data.getPosts];
        proxy.writeQuery({
          query: GET_POSTS_QUERY,
          variables: values,
          data: {
            ...data,
            getPosts: {
              newData,
            },
          },
        });
      }
      if (result.errors && result.errors.length > 0) {
        setErrors(result.errors[0].message);
      } else {
        setErrors("");
      }
      values.body = "";
    },
  });

  function createPostCallback() {
    createPost();
  }

  // if (errors.length > 0) {
  //   //   console.log(error.graphQLErrors[0].message);
  //   console.log(errors);
  // }
  return (
    <>
      <div>
        <Form onSubmit={onSubmit} noValidate>
          <Form.Field>
            <h1>Share Your Thoughts</h1>
            <Form.Input
              placeholder="Share your thoughts"
              name="body"
              type="text"
              error={errors ? true : false}
              onChange={onChange}
              value={values.body}
            />
            <Button
              type="submit"
              color="teal"
              disabled={values.body.trim() === ""}
            >
              Share!
            </Button>
          </Form.Field>
        </Form>
      </div>
      {errors && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{errors}</li>
          </ul>
        </div>
      )}
    </>
  );
}

export default PostForm;
