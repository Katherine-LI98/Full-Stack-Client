import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik"; //validation
import * as Yup from "yup";
import axios from "axios";

function Registration() {
  const initialValues = {
    usename: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    usename: Yup.string().min(3).max(15).required(),
    password: Yup.string().min(4).max(20).required(),
  });

  const onSubmit = (data) => {
    axios
      .post("https://full-stack-api-7700c02c4458.herokuapp.com/auth", data)
      .then(() => {
        console.log(data);
      });
  };
  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Username:</label>
          <ErrorMessage name="username" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="usename"
            placeholder="(Ex. Jhon)"
          />

          <label>Password:</label>
          <ErrorMessage name="password" component="span" />
          <Field
            autoComplete="off"
            type="password"
            id="inputCreatePost"
            name="password"
            placeholder="Your password"
          />
          <button type="submit"> Register</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Registration;
