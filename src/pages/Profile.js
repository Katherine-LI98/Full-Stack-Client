import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Profile() {
  let { id } = useParams();
  let history = useNavigate();
  const [usename, setUsename] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(
        `https://full-stack-api-7700c02c4458.herokuapp.com/auth/basicinfo/${id}`
      )
      .then((response) => {
        setUsename(response.data.usename);
      });
    axios
      .get(
        `https://full-stack-api-7700c02c4458.herokuapp.com/posts/byuserId/${id}`
      )
      .then((response) => {
        setListOfPosts(response.data);
      });
  }, []);

  return (
    <div className="profilePageContainer">
      <div className="basicInfo">
        {" "}
        <h1>Username:{usename}</h1>
        {authState.usename === usename && (
          <button
            onClick={() => {
              history("/changepassword");
            }}
          >
            {" "}
            Change My Password
          </button>
        )}
      </div>
      <div className="listOfPosts">
        {listOfPosts.map((value, key) => {
          return (
            <div key={key} className="post">
              <div className="title">{value.title} </div>
              <div
                className="body"
                onClick={() => {
                  history(`/post/${value.id}`);
                }}
              >
                {value.postText}{" "}
              </div>
              <div className="footer">
                <div className="username"> {value.usename} </div>
                <div className="buttons">
                  <label>{value.Likes.length}</label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Profile;
