import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState([]);
  const { authState } = useContext(AuthContext);

  //let goes to which page
  let history = useNavigate();

  useEffect(() => {
    axios
      .get(`https://full-stack-api-7700c02c4458.herokuapp.com/posts/byId/${id}`)
      .then((response) => {
        setPostObject(response.data);
      });

    axios
      .get(`https://full-stack-api-7700c02c4458.herokuapp.com/comments/${id}`)
      .then((response) => {
        setComments(response.data);
      });
  }, [id]);

  const addComment = () => {
    axios
      .post(
        "https://full-stack-api-7700c02c4458.herokuapp.com/comments",
        {
          commentBody: newComment,
          PostId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          //without refresh show the coments
          const commentToAdd = {
            commentBody: newComment,
            usename: response.data.usename,
          };
          setComments([...comments, commentToAdd]);
          //clear the input when finishing adding comments
          setNewComment("");
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(
        `https://full-stack-api-7700c02c4458.herokuapp.com/comments/${id}`,
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      )
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`https://full-stack-api-7700c02c4458.herokuapp.com/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        history("/");
      });
  };

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter New Title:");
      axios.put(
        `https://full-stack-api-7700c02c4458.herokuapp.com/posts/title`,
        { newTitle: newTitle, id: id },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      );
      //update without refresh

      setPostObject({ ...postObject, title: newTitle });
    } else {
      let newPostText = prompt("Enter New Text:");
      axios.put(
        `https://full-stack-api-7700c02c4458.herokuapp.com/posts/postText`,
        { newText: newPostText, id: id },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      );
      setPostObject({ ...postObject, postText: newPostText });
    }
  };

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div
            className="title"
            onClick={() => {
              if (authState.usename === postObject.usename) {
                editPost("title");
              }
            }}
          >
            {postObject.title}
          </div>
          <div
            className="postText"
            onClick={() => {
              if (authState.usename === postObject.usename) {
                editPost("body");
              }
            }}
          >
            {postObject.postText}
          </div>
          <div className="footer">
            {postObject.usename}{" "}
            {authState.usename === postObject.usename && (
              <button
                onClick={() => {
                  deletePost(postObject.id);
                }}
              >
                Delete Post
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          />
          <button onClick={addComment}> Add Comments</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                {comment.commentBody}
                <label>Username: {comment.usename} </label>
                {authState.usename === comment.usename && (
                  <button
                    onClick={() => {
                      deleteComment(comment.id);
                    }}
                  >
                    X
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;
