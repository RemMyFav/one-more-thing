/* eslint-disable */
import * as React from "react";
import { useEffect, useRef } from "react";
import Select from "react-select";

import axios from "../api/axios";

export default function MultipleSelectCheckmarks({ handleCallback }) {
  const dropdownStyles = {
    text: "black",
  };
  const [allusers, setallusers] = React.useState([]);
  const [allusernames, setallusernames] = React.useState([]);
  const [selecteduser, setselecteduser] = React.useState();

  const selecteduserRef = useRef();
  const allusersRef = useRef();

  //get all users from database+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  const getAllUsers = async () => {
    const response = await axios
      .get("/user/all", { withCredentials: true })
      .catch((err) => {
        if (err === 401) {
          navigate("/login");
        }
        console.log(err);
      });
    let temp = [];
    response.data.forEach((element) => {
      temp.push({ value: element._id, label: element.username });
    });
    setallusers(response.data);
    setallusernames(temp);
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    selecteduserRef.current = selecteduser;
    allusersRef.current = allusers;
  }, [allusers, selecteduser]);

  const handleChange = async (data) => {
    const selectedUsernames = data.map((element) => element.label);
    const selectedUserId = data.map((element) => element.value);

    setselecteduser(data);
    handleCallback(selectedUsernames, selectedUserId);
  };
  return (
    <div>
      <Select
        multiple
        value={selecteduser}
        onChange={handleChange}
        options={allusernames}
        placeholder="Select a user"
        isSearchable={true}
        isMulti
        styles={dropdownStyles}
      />
    </div>
  );
}
