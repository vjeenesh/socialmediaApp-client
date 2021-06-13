import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/client";

import { useForm } from "../utils/hooks";
import { AuthContext } from "../context/auth";
import { REGISTER_USER } from "../utils/graphql";

export default function Register(props) {
  const { login } = useContext(AuthContext);
  const { onChange, onSubmit, values } = useForm(registerCb, {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [register, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      login(userData);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function registerCb() {
    register();
  }

  return (
    <div className="form-container">
      <h1 className="form-title">Register</h1>
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
          name="email"
          placeholder="Email"
          label="Email"
          error={errors.email ? true : false}
          onChange={onChange}
          value={values.email}
        />
        <Form.Input
          name="password"
          placeholder="Password"
          label="Password"
          type="password"
          error={errors.password ? true : false}
          onChange={onChange}
          value={values.password}
        />
        <Form.Input
          name="confirmPassword"
          placeholder="Confirm Password"
          type="password"
          error={errors.confirmPassword ? true : false}
          label="Confirm Password"
          onChange={onChange}
          value={values.confirmPassword}
        />
        <Button primary>Register</Button>
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
