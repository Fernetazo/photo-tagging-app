import React, { useState, useEffect } from "react";
import waldo1 from "./images/waldo1.png";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDoc,
  getDocs,
  doc,
} from "firebase/firestore/lite";

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
    //console.log("Left? : " + xImage + " - Top? : " + yImage + ".");

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
      console.log("You already found", character, "...");
    } else {
      setFoundCharacters(foundCharacters.concat(character));
      console.log("You found", character, "!");
    }
  };

  const manageClickOutsideModal = (e) => {
    let modalContainer = document.querySelector(".modalContainer");
    modalContainer.style.opacity = "0";
    modalContainer.style.visibility = "hidden";
  };

  useEffect(() => {
    getLocations(db);
  }, []);

  return (
    <div>
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
