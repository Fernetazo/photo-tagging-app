import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import waldo1 from "./images/waldo1.png";

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

// Get a list of liders from your database
async function getLiderboard(db) {
  const leaderboard = collection(db, "leaderboard");
  const leaderboardSnapshot = await getDocs(leaderboard);
  const leadersboardList = leaderboardSnapshot.docs.map((doc) => doc.data());
  return leadersboardList;
}

let leaderboard = getLiderboard(db);
//console.log(leaderboard);

// TO DO: Get coordinates correctly (when zooming, they change)
const manageImgClicked = (e) => {
  let modalContainer = document.querySelector(".modalContainer");
  modalContainer.style.opacity = "1";
  modalContainer.style.visibility = "visible";

  let xDisplay = e.clientX;
  let yDisplay = e.clientY;
  console.log("X display: " + xDisplay + " - Y display: " + yDisplay + ".");

  let modal = document.querySelector(".modal");
  modal.style.top = yDisplay + "px";
  modal.style.left = xDisplay + 20 + "px";

  // TO DO: Round results (when zoomed, it will throw decimal point numbers)
  // Maybe they wont hurt?
  let rect = e.target.getBoundingClientRect();
  let xImage = xDisplay - rect.left; //x position within the element.
  let yImage = yDisplay - rect.top; //y position within the element.
  console.log("Left? : " + xImage + " - Top? : " + yImage + ".");
};

const manageClickOutsideModal = (e) => {
  let modalContainer = document.querySelector(".modalContainer");
  modalContainer.style.opacity = "0";
  modalContainer.style.visibility = "hidden";
};

const manageChSelection = () => {
  console.log("TODO verify with the server");
};

function App() {
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
}

export default App;
