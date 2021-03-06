import React, { useState, useEffect } from "react";
import SearchPage from "../searchpage";
import ComparePage from "../comparepage";
import AddUserPage from "../adduserpage";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./app.css";
function App() {
  const [userData, setUserData] = useState([]);
  const [input, setInput] = useState(null);
  const [userInfoData, setUserInfoData] = useState("");
  const [reloadPageData, setReloadPageData] = useState(true);
  const [bootcamperData, setBootcamperData] = useState([]);
  const [mentorData, setMentorData] = useState([]);
  const [bootcamperComparePanelData, setBootcamperComparePanelData] = useState("");
  const [mentorComparePanelData, setMentorComparePanelData] = useState("");

  //use effect to GET all the page data
  useEffect(() => {
    console.log('app.js getData running')
    async function getData() {
      let res = await fetch("http://localhost:5000/");
      let data = await res.json();
      setUserData(data.payload);
      setUserInfoData(data.payload[0]);
      setBootcamperData(data.payload.filter((value) => value.isbootcamper === true))
      setMentorData(data.payload.filter((value) => value.isbootcamper === false))
      setBootcamperComparePanelData(data.payload.find((value) => value.isbootcamper === true));
      setMentorComparePanelData(data.payload.find((value) => value.isbootcamper === false))
    }
    getData();
    setReloadPageData(false);
  }, []);

  useEffect(() => {
    async function refreshData() {
      let res = await fetch("http://localhost:5000/");
      let data = await res.json();
      setUserData(data.payload);
    }
    refreshData()
    setReloadPageData(false);
  }, [reloadPageData])


  //use effect to get data based on search query
  useEffect(() => {
    if (input || input === "") {
      async function getSpecificData() {
        let res = await fetch(`http://localhost:5000/?search=${input}`);
        let data = await res.json();
        setUserData(data.payload);
      }
      getSpecificData();
    }
  }, [input]);

  async function deleteUser(id) {
    let res = await fetch(`http://localhost:5000/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    let data = await res.json();
    setReloadPageData(true);
  }

  function returnSingleUserData(userId) {
    setUserInfoData(userData.find((value) => value.id === userId))
  }

  function returnCompareSingleUserData(userId) {
    const userObject = userData.find((value) => value.id === userId)
    if (userObject.isbootcamper === true) {
      setBootcamperComparePanelData(userObject);
    } else if (userObject.isbootcamper === false) {
      setMentorComparePanelData(userObject);
    }
  }

  return (
    <Router>
      <div id="main-page-container">
        <nav>
          <h2>Match SoC</h2>
          <img
            id="page-logo"
            src="https://d33wubrfki0l68.cloudfront.net/e6fddcbea146f91d2f3c160f7d56a9391a4740b0/4e758/static/logo-51c754388b198e5bbb0d08a971ebbfa2.png"
            alt=""
          />
          <ul>
            <li>
              <Link to="/">Search</Link>
            </li>
            <li>
              <Link to="/adduser">Add User</Link>
            </li>
            <li>
              <Link to="/compare">Compare</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/compare">
            <ComparePage
              userData={userData}
              bootcamperData={bootcamperData}
              mentorData={mentorData}
              returnSingleUserData={returnCompareSingleUserData}
              bootcamperComparePanelData={bootcamperComparePanelData}
              mentorComparePanelData={mentorComparePanelData}
              setReloadPageData={setReloadPageData}
            />
          </Route>
          <Route path="/adduser">
            <AddUserPage setReloadPageData={setReloadPageData} />
          </Route>
          <Route path="/">
            <SearchPage
              setInput={setInput}
              userData={userData}
              returnSingleUserData={returnSingleUserData}
              userInfoData={userInfoData}
              deleteUser={deleteUser}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
export default App;
