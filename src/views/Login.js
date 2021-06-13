import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/client";

import { useForm } from "../utils/hooks";
import { AuthContext } from "../context/auth";
import { LOGIN_USER } from "../utils/graphql";

export default function Login(props) {
  const { onChange, onSubmit, values } = useForm(loginUserCb, {
    username: "",
    password: "",
  });
  const { login } = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      login(userData);
      props.history.push("/");
    },
    onError(err) {
      // console.log(err.graphQLErrors);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function loginUserCb() {
    loginUser();
  }

  return (
    <div className="form-container">
      <h1 className="form-title">Login</h1>
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <Form.Input
          name="username"
          placeholder="Username"
          label="Username"
          error={errors.username ? true : false}
          onChange={onChange}
          value={values.username}
        />

        <Form.Input
          name="password"
          placeholder="Password"
          type="password"
          label="Password"
          error={errors.password ? true : false}
          onChange={onChange}
          value={values.password}
        />

        <Button primary>Login</Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((e) => {
              return <li key={e}>{e}</li>;
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
