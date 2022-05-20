import React, { useState, useEffect } from "react";
import waldo1 from "./images/waldo1.png";
import Waldo from "./images/waldo-mini.jpg";
import Odlaw from "./images/odlaw-mini.jpg";
import Wizard from "./images/wizard-mini.jpeg";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  doc,
} from "firebase/firestore";
// Note: firestore lite version doesnt work well. Has missing functions

const App = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyCkD50M6XKeVkPQYIygb1_rSjdmOfFyoo0",
    authDomain: "photo-tagging-app-1b523.firebaseapp.com",
    projectId: "photo-tagging-app-1b523",
    storageBucket: "photo-tagging-app-1b523.appspot.com",
    messagingSenderId: "308150812667",
    appId: "1:308150812667:web:ed1c5e8a7e60d64b82d55e",
    measurementId: "G-X4K06VV8H3",
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const [initialTime, setInitialTime] = useState();
  const [finalTime, setFinalTime] = useState();
  const [locations, setLocations] = useState();
  const [userCoordinates, setUserCoordinates] = useState();
  const [foundCharacters, setFoundCharacters] = useState([]);

  /*
// Get a list of liders from your database
async function getLiderboard(db) {
  const leaderboard = collection(db, "leaderboard");
  const leaderboardSnapshot = await getDocs(leaderboard);
  const leadersboardList = leaderboardSnapshot.docs.map((doc) => doc.data());
  return leadersboardList;
}

let leaderboard = getLiderboard(db);
//console.log(leaderboard);
*/

  // Get a list of locations from your database
  async function getLocations(db) {
    const docRef = doc(db, "locations", "coordinates");
    const docSnap = await getDoc(docRef);

    // Converts object (docSnap.data()) to array of objects to save it on hook state
    const arrayOfObj = Object.entries(docSnap.data()).map((e) => ({
      [e[0]]: e[1],
    }));

    setLocations(arrayOfObj);
  }

  const manageImgClicked = (e) => {
    let modalContainer = document.querySelector(".modalContainer");
    modalContainer.style.opacity = "1";
    modalContainer.style.visibility = "visible";

    let xDisplay = e.clientX;
    let yDisplay = e.clientY;

    let modal = document.querySelector(".modal");
    modal.style.top = yDisplay + "px";
    modal.style.left = xDisplay + 20 + "px";

    let rect = e.target.getBoundingClientRect();
    let xImage = xDisplay - rect.left; //x position within the element.
    let yImage = yDisplay - rect.top; //y position within the element.

    setUserCoordinates([xImage, yImage]);
  };

  const manageChSelection = (e) => {
    let character = e.target.textContent;
    let index = locations.findIndex((obj) => Object.keys(obj)[0] === character);

    if (
      userCoordinates[0] > Object.values(locations[index])[0][0] &&
      userCoordinates[0] < Object.values(locations[index])[0][2] &&
      userCoordinates[1] > Object.values(locations[index])[0][1] &&
      userCoordinates[1] < Object.values(locations[index])[0][3]
    ) {
      checkCharacters(character);
    } else {
      console.log("No, it's not");
    }
  };

  const checkCharacters = (character) => {
    if (foundCharacters.some((e) => e === character)) {
      console.log("You already found " + character + "...");
    } else {
      setFoundCharacters(foundCharacters.concat(character));
      console.log("You found " + character + "!");
      changeIconStyle(character);
    }
  };

  const changeIconStyle = (character) => {
    let iconContainer = document.querySelector("." + character);
    iconContainer.style.textDecoration = "line-through";
    iconContainer.style.opacity = "0.3";
  };

  const manageClickOutsideModal = (e) => {
    let modalContainer = document.querySelector(".modalContainer");
    modalContainer.style.opacity = "0";
    modalContainer.style.visibility = "hidden";
  };

  const checkWin = () => {
    if (foundCharacters.length === 1) {
      let modalEndgameContainer = document.querySelector(
        ".modalEndgameContainer"
      );
      modalEndgameContainer.style.opacity = "1";
      modalEndgameContainer.style.visibility = "visible";

      setFinalTime(((new Date() - new Date(initialTime)) / 1000).toFixed(2));
    }
  };

  const sendInput = async () => {
    let modalEndgameContainer = document.querySelector(
      ".modalEndgameContainer"
    );
    modalEndgameContainer.style.opacity = "0";
    modalEndgameContainer.style.visibility = "hidden";
    let input = document.querySelector(".modalEndgameInput").value;
    await addDoc(collection(db, "leaderboard"), {
      name: input,
      time: finalTime,
    });
    //TODO show leaders
  };

  useEffect(() => {
    getLocations(db);
    setInitialTime(new Date());
  }, []);

  useEffect(() => {
    checkWin();
  }, [foundCharacters]);

  return (
    <div>
      <header>
        <div className="iconsContainer">
          <div className="iconContainer Waldo">
            <img className="icon" src={Waldo} alt="Waldo icon"></img>
            <div className="iconText">Waldo</div>
          </div>
          <div className="iconContainer Odlaw">
            <img className="icon" src={Odlaw} alt="Odlaw icon"></img>
            <div className="iconText">Odlaw</div>
          </div>
          <div className="iconContainer Wizard">
            <img className="icon" src={Wizard} alt="Wizard icon"></img>
            <div className="iconText">Wizard</div>
          </div>
        </div>
      </header>
      <div className="modalEndgameContainer">
        <div className="modalEndgame">
          <div className="modalEndgameText">YOU WIN!!!</div>
          <div className="modalEndgameText">Your time is:</div>
          <div className="modalEndgameText">{finalTime} seconds</div>
          <div className="modalEndgameText">
            Please, enter your name to register it in the leaderboard:
          </div>
          <input
            className="modalEndgameInput"
            type="text"
            placeholder="Name"
          ></input>
          <button className="modalEndgameButton" onClick={sendInput}>
            Send
          </button>
        </div>
      </div>
      <div className="modalContainer" onClick={manageClickOutsideModal}>
        <div className="modal">
          Who is it?
          <div className="modalOption" onClick={manageChSelection}>
            Waldo
          </div>
          <div className="modalOption" onClick={manageChSelection}>
            Odlaw
          </div>
          <div className="modalOption" onClick={manageChSelection}>
            Wizard
          </div>
        </div>
      </div>
      <div className="imageContainer">
        <img
          className="mainImage"
          src={waldo1}
          onClick={manageImgClicked}
          alt="Where is Waldo?"
          useMap="#map1"
        ></img>

        <map id="idMap1" name="map1" onClick={manageImgClicked}>
          <area shape="rect" alt="waldo" coords="506,341,546,402" target="" />
          <area
            shape="rect"
            alt="odlaw"
            title=""
            coords="225,343,258,419"
            target=""
          />
          <area
            shape="rect"
            alt="wizard"
            title=""
            coords="602,339,645,408"
            target=""
          />
        </map>
      </div>
    </div>
  );
};

export default App;
