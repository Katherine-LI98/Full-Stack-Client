import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { AuthContext } from "../helpers/AuthContext";
import { Link } from "react-router-dom";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  //to check if the button should be liked or unliked
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  let history = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history("/login");
    } else {
      axios
        .get("https://full-stack-api-7700c02c4458.herokuapp.com/posts", {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((response) => {
          setListOfPosts(response.data.listOfPosts);
          setLikedPosts(
            response.data.likedPosts.map((like) => {
              return like.PostId;
            })
          );
        });
    }
  }, []);

  const likePost = (postId) => {
    axios
      .post(
        "https://full-stack-api-7700c02c4458.herokuapp.com/likes",
        { PostId: postId },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        //map function can make change on individual element in a list
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likeArray = post.Likes;
                likeArray.pop();
                return { ...post, Likes: likeArray };
              }
            } else {
              return post;
            }
          })
        );
        // make the button update without refresh the page
        if (likedPosts.includes(postId)) {
          setLikedPosts(
            likedPosts.filter((id) => {
              return id != postId;
            })
          );
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };

  return (
    <div>
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
              <div className="username">
                <Link to={`/profile/${value.UserId}`}>{value.usename}</Link>
              </div>
              <div className="buttons">
                <FavoriteIcon
                  onClick={() => {
                    likePost(value.id);
                  }}
                  className={
                    likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                  }
                />
              </div>

              <label>{value.Likes.length}</label>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
