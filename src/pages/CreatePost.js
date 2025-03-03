import React, { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik"; //validation
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function CreatePost() {
  const { authState } = useContext(AuthContext);
  let history = useNavigate();
  const initialValues = {
    title: "",
    postText: "",
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history("/login");
    }
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(),
    postText: Yup.string().required(),
  });

  const onSubmit = (data) => {
    axios
      .post("https://full-stack-api-7700c02c4458.herokuapp.com/posts", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        history("/");
      });
  };

  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Title:</label>
          <ErrorMessage name="title" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="title"
            placeholder="(Ex. Titile)"
          />
          <label>Post:</label>
          <ErrorMessage name="postText" component="span" />
          <Field
            id="inputCreatePost"
            name="postText"
            placeholder="(Ex. Post)"
          />
          <button type="submit"> Create Post</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;
