import React, { useState } from "react";
import axios from "axios";

function ChangePassword() {
  const [oldPassword, setOldpassword] = useState("");
  const [newPassword, setNewpassword] = useState("");

  const changePassword = () => {
    axios
      .put(
        "https://full-stack-api-7700c02c4458.herokuapp.com/auth/changepassword",
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        }
      });
  };

  return (
    <div>
      <h1>Change Your Password</h1>
      <input
        type="text"
        placeholder="Old Password..."
        onChange={(event) => {
          setOldpassword(event.target.value);
        }}
      />
      <input
        type="text"
        placeholder="New Password..."
        onChange={(event) => {
          setNewpassword(event.target.value);
        }}
      />
      <button onClick={changePassword}> Save Changes</button>
    </div>
  );
}

export default ChangePassword;
