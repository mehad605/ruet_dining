import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, getDocs, addDoc , doc, setDoc, updateDoc
} from 'firebase/firestore'
import {
   getStorage, ref, uploadBytes, getDownloadURL
} from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword
} from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyC9DQ-8QfVbSskULTG-nFC8mNVkh-fbY9g",
  authDomain: "ruet-dyning.firebaseapp.com",
  projectId: "ruet-dyning",
  storageBucket: "ruet-dyning.appspot.com",
  messagingSenderId: "245177251851",
  appId: "1:245177251851:web:808356e669d9f156e1af0e",
  measurementId: "G-4MWP8HZT9F"
}

// init firebase
initializeApp(firebaseConfig);


// init services
const db = getFirestore();
const storage = getStorage();
const auth = getAuth();
var docRef;
var userEmail;













  //=============================  Log In Page Javascript  ===============================



  async function signup(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      return user;
    } catch (error) {
      console.error('Error signing up:', error.message);
      throw error;
    }
  }




  async function signIn(email, password) {
    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
      // Access the signed-in user object
      const user = userCredential.user;
  
      // Return the user object or any other relevant data
      return user;
    } catch (error) {
      throw error;
    }
  }





function loginPage(){
var sign_in_btn = document.querySelector("#sign-in-btn");
var sign_up_btn = document.querySelector("#sign-up-btn");
var container = document.querySelector(".container");
var signUpSubmitButton = document.getElementById('signUpSubmitButton');
var loginButton = document.getElementById('loginButton');

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener('click', ()=>{
  container.classList.remove("sign-up-mode");
});

signUpSubmitButton.addEventListener("click", (event) => {
  event.preventDefault();
 let signUpUserName = document.getElementById('signUpUserName').value;
 let signUpEmail = document.getElementById('signUpEmail').value;
 let signUpPassword = document.getElementById('signUpPassword').value;

 signup(signUpEmail, signUpPassword)
  .then(user => {
    userEmail= signUpEmail;
    
    localStorage.setItem("userid", user.uid);
    localStorage.setItem("userEmail", userEmail);
    window.location.href = './order.html';
  })
  .catch(error => {
    alert(error.message);
  });
});

loginButton.addEventListener("click", (event) => {
  event.preventDefault();
  let loginEmail = document.getElementById('loginEmail').value;
  let loginPassword = document.getElementById('loginPassword').value;
 
  signIn(loginEmail, loginPassword)
  .then(user => {
    userEmail= loginEmail;
    localStorage.setItem("userid", user.uid);
    localStorage.setItem("userEmail", userEmail);
    
    window.location.href = './order.html';
    
  })
  .catch(error => {
    alert(error.message);
  });
 });

}









//============================  Order Page Javascript ===========================




var show_item_price_in_menu, meal_name = 'Lunch', hall_name = 'Bangabandhu Sheikh Mujibur Rahman Hall',text_in_add_to_cart_button;

var reference = hall_name+'/Menu/'+meal_name;
var item_name, item_price, item_availability, item_image_source;
 // collection ref
 var colRef = collection(db, reference);


function showDate(){
   userEmail = localStorage.getItem("userEmail");
   

  var nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 1); // Add 1 day to the current date
    // Define an array of month names
    var monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    
    
  // Handle cases where the next day falls in the next month or year
  if (nextDay.getDate() === 1) {
    nextDay.setMonth(nextDay.getMonth() + 1); // Add 1 month
    if (nextDay.getMonth() === 0) {
      nextDay.setFullYear(nextDay.getFullYear() + 1); // Add 1 year
    }
  }

// Extract the date parts
var month = monthNames[nextDay.getMonth()]; // Get month name from array
var day = nextDay.getDate();
var year = nextDay.getFullYear();


    // Format the date as desired (e.g., "Month DD, YYYY")
    var formattedDate = month + " " + day + ", " + year;

    sessionStorage.setItem('formattedDate', formattedDate)
  
    // Update the innerHTML of the display element
    document.getElementById('show-date').innerHTML  = formattedDate;
}






function showMenuItems(item_name, show_item_price_in_menu, image_source){

  
    text_in_add_to_cart_button='Add to cart'
  

  // Create a new element
var newElement = document.createElement('div');

// Set class name for the new element
newElement.className = 'card my-3 shadow border-0 pt-2';

// Set styles for the new element
newElement.style.width = '18rem';


newElement.innerHTML = `
<img
  src="${image_source}"
  class="card-img-top"
  alt="..."
/>
<div class="card-body">
  <h5 class="card-title">
    <div class="row">
      <div class="col">${item_name}</div>
      <div class="col text-end">${show_item_price_in_menu} </div>
    </div>
  </h5>
  <a class="btn btn-secondary w-100" id="${item_name}" onclick="addToCartClicked(event, '${meal_name}', '${item_price}', '${hall_name}')">${text_in_add_to_cart_button}</a>
</div>`;




// Get the parent element by its ID name
var parentElement = document.getElementById('menu-items-card-holder');

// Append the new element to the parent element
parentElement.appendChild(newElement);
 
}

 


function menu(){

 colRef = collection(db, reference);

// get collection data
getDocs(colRef)
  .then(snapshot => {
    // console.log(snapshot.docs)
    let items = []
    
    snapshot.docs.forEach(doc => {
      items.push({ ...doc.data(), id: doc.id })
        item_name = doc.id;
        item_price = doc.data().Price;
        item_image_source = doc.data().url;
        item_availability = doc.data().Available;
        if(item_price == 0){
          show_item_price_in_menu = 'Complementary'
        }else{
          show_item_price_in_menu = item_price +'/='
        }
        if(item_availability){
          showMenuItems(item_name, show_item_price_in_menu,item_image_source)
        }
    })
    
  })
  .catch(err => {
    item_name = 'Error';
        item_price = 'Error';
        item_availability = false;
  });

}




function lunchButtonClicked(){
  document.getElementById('lunch-button').addEventListener("click", function() {
    let lunch_button = document.getElementById('lunch-button');
    lunch_button.style.color = 'white';
    lunch_button.style.backgroundColor = 'rgba(63, 99, 183, 0.689)';
    let dinner_button = document.getElementById('dinner-button');
    dinner_button.style.color = 'black';
    dinner_button.style.backgroundColor = 'white';
    document.getElementById('menu-items-card-holder').innerHTML='';

    meal_name = 'Lunch';
    reference = hall_name+'/Menu/'+meal_name;
    menu();
  
  });
}


function dinnerButtonClicked(){
  document.getElementById('dinner-button').addEventListener("click", function() {
    let dinner_button = document.getElementById('dinner-button');
    dinner_button.style.color = 'white';
    dinner_button.style.backgroundColor = 'rgba(63, 99, 183, 0.689)';
    let lunch_button = document.getElementById('lunch-button');
    lunch_button.style.color = 'black';
    lunch_button.style.backgroundColor = 'white';
    document.getElementById('menu-items-card-holder').innerHTML='';

    meal_name = 'Dinner';
    reference = hall_name+'/Menu/'+meal_name;
    menu();
  
  });
}



function showSelectedHallName(){
  document.getElementById("myDropdownMenu").addEventListener("click", function(event) {
    meal_name='Lunch';
     hall_name = event.target.textContent;
     
    document.getElementById("showSelectedHallName").innerHTML = `<div class="row py-3 m-0 third-row">
    <div class="col">
      <div class="row m-0 py-3 first-row">
        <div class="col">
          <button
            type="button"
            class="btn btn-secondary btn-lg w-100 disabled"
            id="show-selected-hall-name"
          >
            ${hall_name}
          </button>
        </div>
      </div>
    </div>
  </div>`;
  document.getElementById('menu-items-card-holder').innerHTML='';
  let lunch_button = document.getElementById('lunch-button');
    lunch_button.style.color = 'white';
    lunch_button.style.backgroundColor = 'rgba(63, 99, 183, 0.689)';
    let dinner_button = document.getElementById('dinner-button');
    dinner_button.style.color = 'black';
    dinner_button.style.backgroundColor = 'white';
  reference = hall_name+'/Menu/'+meal_name;
  window.selectedItemForLunch.length= 0;
  window.selectedItemForDinner.length= 0;
  menu();
  });
}

var item_image_download_url;
var image_storageRef;

async function uploadImage() {
  const imageInput = document.getElementById("imageInput");
  const file = imageInput.files[0];

  if (file) {
    // Create a storage reference
     image_storageRef = ref(storage, hall_name+"/" + file.name);

    // Upload the file
    uploadBytes(image_storageRef, file)
      .then(() => {
        console.log("Image uploaded successfully!");

    
        // getDownloadURL(image_storageRef)
        //   .then((downloadURL) => {
        //     item_image_download_url = downloadURL;
            
        //   })
        //   .catch((error) => {
        //     console.error("Error getting download URL: ", error);
        //   });
      })
      .catch((error) => {
        console.error("Error uploading image: ", error);
      });
  } else {
    console.log("No file selected.");
  }
}


function addItemButtonClicked(){
  document.getElementById('add-element-container').addEventListener("click", function(event){
    document.getElementById('popup-container').style.display = "block";
    document.getElementById('add-item-lunch-button').innerHTML = meal_name;
  });

  
}

function closeAddItemPopupClicked(){
  document.getElementById('close-add-item-popup').addEventListener("click", function(event){
    document.getElementById('popup-container').style.display = "none";
  });
}


function submitAddItemButtonClicked() {
  document.getElementById("submit-add-item-popup").addEventListener("click", async function (event) {
    var newItemName = document.getElementById("itemNameToBeAdded").value;
    var newItemValue = Number(document.getElementById("itemPriceToBeAdded").value);

    reference = hall_name + "/Menu/" + meal_name;

    var collectionRef = collection(db, reference);
    var documentId = newItemName; // specify the document ID

    // Create a new document with the data you want to add
    var newItemData = {
      Available: true,
      Price: newItemValue,
      url: item_image_download_url,
    };

    try {
      // Upload the image to Firebase Storage
  await uploadImage();

  // Get the download URL for the image
  const downloadURL = await getDownloadURL(image_storageRef);

  // Update the newItemData with the download URL
  newItemData.url = downloadURL;
      // Set the new document data for the selected document ID
      await setDoc(doc(collectionRef, documentId), newItemData);
      document.getElementById("popup-container").style.display = "none";
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  });
}







function orderPage(){
  
  showDate();

  menu();

  lunchButtonClicked();

  dinnerButtonClicked();

  showSelectedHallName();

addItemButtonClicked();

closeAddItemPopupClicked();

submitAddItemButtonClicked();


}





//--------------------------------   Cart Page   ------------------------------------------



var selectedItemForLunch = JSON.parse(sessionStorage.getItem('selectedItemForLunch'));
    var selectedItemForLunchPrice = JSON.parse(sessionStorage.getItem('selectedItemForLunchPrice'));

    const lunch_cartItemsContainer = document.getElementById('lunch_cartItems');
    const lunch_totalPriceContainer = document.getElementById('lunch_totalPrice');
    const lunchcheckoutButton = document.getElementById('make_payment_lunch');


    var selectedItemForDinner = JSON.parse(sessionStorage.getItem('selectedItemForDinner'));
    var selectedItemForDinnerPrice = JSON.parse(sessionStorage.getItem('selectedItemForDinnerPrice'));

    const dinner_cartItemsContainer = document.getElementById('dinner_cartItems');
    const dinner_totalPriceContainer = document.getElementById('dinner_totalPrice');
    const dinnercheckoutButton = document.getElementById('make_payment_dinner');





function lunch_renderCartItems() {
  if (sessionStorage.getItem('lunch_hall_name') != null || sessionStorage.getItem('lunch_hall_name') != undefined) {
    document.getElementById('lunch_cart_hall_name').textContent = sessionStorage.getItem('lunch_hall_name');
  }
  lunch_cartItemsContainer.innerHTML = '';
  let lunch_total = 0;

  for (let i = 0; i < selectedItemForLunch.length; i++) {
    const itemElement = document.createElement('div');
    itemElement.classList.add('item');

    const nameElement = document.createElement('span');
    nameElement.classList.add('item-name');
    nameElement.textContent = selectedItemForLunch[i];

    const priceElement = document.createElement('span');
    priceElement.classList.add('item-price');
    priceElement.textContent = `${selectedItemForLunchPrice[i]}/=`;

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fas', 'fa-trash', 'delete-icon');

    // Attach event listener to delete icon
    deleteIcon.addEventListener('click', function() {
      lunch_removeItem(i);
    });

    
    itemElement.appendChild(nameElement);
    itemElement.appendChild(priceElement);
    itemElement.appendChild(deleteIcon);

    lunch_cartItemsContainer.appendChild(itemElement);
    lunch_total += selectedItemForLunchPrice[i];
  }

  lunch_totalPriceContainer.textContent = `Total: ${lunch_total}/=`;
}

function lunch_removeItem(index) {
  selectedItemForLunch.splice(index, 1);
  selectedItemForLunchPrice.splice(index, 1);
  sessionStorage.setItem('selectedItemForLunch', JSON.stringify(selectedItemForLunch));
  sessionStorage.setItem('selectedItemForLunchPrice', JSON.stringify(selectedItemForLunchPrice));
  lunch_renderCartItems();
}







function dinner_renderCartItems() {
  if (sessionStorage.getItem('dinner_hall_name') != null || sessionStorage.getItem('dinner_hall_name') != undefined) {
    document.getElementById('dinner_cart_hall_name').textContent = sessionStorage.getItem('dinner_hall_name');
  }
  dinner_cartItemsContainer.innerHTML = '';
  let dinner_total = 0;

  for (let i = 0; i < selectedItemForDinner.length; i++) {
    const itemElement = document.createElement('div');
    itemElement.classList.add('item');

    const nameElement = document.createElement('span');
    nameElement.classList.add('item-name');
    nameElement.textContent = selectedItemForDinner[i];

    const priceElement = document.createElement('span');
    priceElement.classList.add('item-price');
    priceElement.textContent = `${selectedItemForDinnerPrice[i]}/=`;

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fas', 'fa-trash', 'delete-icon');

    // Attach event listener to delete icon
    deleteIcon.addEventListener('click', function() {
      dinner_removeItem(i);
    });

    
    itemElement.appendChild(nameElement);
    itemElement.appendChild(priceElement);
    itemElement.appendChild(deleteIcon);

    dinner_cartItemsContainer.appendChild(itemElement);
    dinner_total += selectedItemForDinnerPrice[i];
  }

  dinner_totalPriceContainer.textContent = `Total: ${dinner_total}/=`;
}

function dinner_removeItem(index) {
  selectedItemForDinner.splice(index, 1);
  selectedItemForDinnerPrice.splice(index, 1);
  sessionStorage.setItem('selectedItemForDinner', JSON.stringify(selectedItemForDinner));
  sessionStorage.setItem('selectedItemForDinnerPrice', JSON.stringify(selectedItemForDinnerPrice));
  dinner_renderCartItems();
}

 async function completePayment(meal_name, hall_name) {
  var reference = hall_name + '/Orders/' + sessionStorage.getItem('formattedDate')+'/' + meal_name + '/'+ 'Pending';

  var userEmail = localStorage.getItem('userEmail');

  var selectedItemForLunch = JSON.parse(sessionStorage.getItem('selectedItemForLunch'));
  var selectedItemForLunchPrice = JSON.parse(sessionStorage.getItem('selectedItemForLunchPrice'));
  var selectedItemForDinner = JSON.parse(sessionStorage.getItem('selectedItemForDinner'));
  var selectedItemForDinnerPrice = JSON.parse(sessionStorage.getItem('selectedItemForDinnerPrice'));

  // Create a new document with the data you want to add
  const newItemData = {}; // Create an empty object
  const updateOrderIdInUser = {};
  const currentTime = new Date();
  const autoGeneratedDoc = doc(collection(db, reference));
       updateOrderIdInUser[sessionStorage.getItem('formattedDate')] = autoGeneratedDoc.id,
      updateOrderIdInUser["hall"] = hall_name;


  if (meal_name === 'Lunch') {
  
   
  
  selectedItemForLunch.forEach((item) => {
    if (newItemData.hasOwnProperty(item)) {
      newItemData[item]++;
    } else {
      newItemData[item] = 1;
    }
  });
  await setDoc(autoGeneratedDoc, newItemData).then(
    
    await setDoc(doc(db, 'user/'+ localStorage.getItem("userid")+'/order/'+sessionStorage.getItem('formattedDate')+'/'+meal_name, currentTime.toString()), updateOrderIdInUser),
    
  );

  selectedItemForLunch=[];
  selectedItemForLunchPrice=[];
  sessionStorage.removeItem('selectedItemForLunch');
  sessionStorage.removeItem('selectedItemForLunchPrice');
  
  lunch_renderCartItems();
  location.reload();

  

 


    
    
  } else if (meal_name === 'Dinner') {
    selectedItemForDinner.forEach((item) => {
      if (newItemData.hasOwnProperty(item)) {
        newItemData[item]++;
      } else {
        newItemData[item] = 1;
      }
    });
    await setDoc(autoGeneratedDoc, newItemData).then(
      
      await setDoc(doc(db, 'user/'+ localStorage.getItem("userid")+'/order/'+sessionStorage.getItem('formattedDate')+'/'+meal_name, currentTime.toString()), updateOrderIdInUser),
      
    );

    selectedItemForDinner=[];
    selectedItemForDinnerPrice=[];
    sessionStorage.removeItem('selectedItemForDinner');
    sessionStorage.removeItem('selectedItemForDinnerPrice');

    dinner_renderCartItems();
    location.reload();


  }

 
}









function cartPage(){

  


    if(selectedItemForLunch){
      lunch_renderCartItems();
    }
    if(selectedItemForDinner){
      dinner_renderCartItems();
    }
    

    

    lunchcheckoutButton.addEventListener('click', function() {

      completePayment('Lunch',sessionStorage.getItem('lunch_hall_name'));
      alert('Lunch payment completed!');
      // Perform additional actions here, such as redirecting to a payment gateway
    });

    dinnercheckoutButton.addEventListener('click', function() {
      completePayment('Dinner',sessionStorage.getItem('dinner_hall_name'));
      alert('Dinner payment completed!');
      // Perform additional actions here, such as redirecting to a payment gateway
    });
}




// ==========================   Order History page   ===============================





function showqr(meal_name) {
  var qr_lunch_button = document.getElementById("lunch-button");
  var qr_dinner_button = document.getElementById("dinner-button");
  var monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  var current_day = new Date();
  var month = monthNames[current_day.getMonth()];
  var day = current_day.getDate();
  var year = current_day.getFullYear();

  var current_formattedDate = month + " " + day + ", " + year;

  var reference = 'user/' + localStorage.getItem("userid") + '/order/' + current_formattedDate + '/' + meal_name;
  var colRef = collection(db, reference);

  document.getElementById('lunch_qr').innerHTML ='';
  document.getElementById('dinner_qr').innerHTML ='';

  // Get collection data
  getDocs(colRef)
    .then(snapshot => {
      snapshot.docs.forEach(async doc => {
        if (doc.exists) {
          var order_id = await doc.data()[current_formattedDate];
          var newElement = document.createElement('div');
          var newElementForOrderId = document.createElement('div');
          newElementForOrderId.innerHTML = `<div class="row d-flex justify-content-center align-items-center">Order Id: ${order_id}</div>`;
          if (order_id !== null) {
            newElement.innerHTML = await generateQRCode(order_id);
          } else {
            newElement.innerHTML = "No order ID found";
          }

          newElement.appendChild(newElementForOrderId);

          if (meal_name === 'Lunch') {
            document.getElementById("lunch_qr").appendChild(newElement);
          } else if (meal_name === 'Dinner') {
            document.getElementById("dinner_qr").appendChild(newElement);
          }
        } else {
          console.log("Document does not exist");
        }
      });
    })
    .catch(err => {
      console.log('Error getting the data:', err);
    });
}

function generateQRCode(order_id) {
  var qr = qrcode(0, 'L');
  qr.addData(order_id);
  qr.make();
  var svgTag = qr.createSvgTag({ cellSize: 10 });
  return svgTag;
}

function toggle_in_qr() {
  const lunchButton = document.getElementById("lunch-button");
  const dinnerButton = document.getElementById("dinner-button");

  // Get the lunch and dinner tab elements
  const lunchTab = document.getElementById("lunch");
  const dinnerTab = document.getElementById("dinner");

  // Add click event listeners to the buttons
  lunchButton.addEventListener("click", () => {
    lunchTab.classList.add("show", "active");
    dinnerTab.classList.remove("show", "active");
    showqr('Lunch');
  });

  dinnerButton.addEventListener("click", () => {
    dinnerTab.classList.add("show", "active");
    lunchTab.classList.remove("show", "active");
    showqr('Dinner');
  });
}






function historyPage(){
      toggle_in_qr();
}



// ================  log out page  =========================


function logOut(){
  const logoutButton = document.getElementById('logoutBtn');
  logoutButton.addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
      // Redirect to login page or any other page after logout
      window.location.href = './index.html';
    }).catch((error) => {
      console.log(error.message);
    });
  });
}






//===============================  Select Javascript function  =================

if(document.title == 'Log In'){
  loginPage();
}
else if(document.title == 'Order Meal'){
  orderPage();
}
else if(document.title == 'Cart'){
  cartPage();
}
else if(document.title == 'Order History'){
  historyPage();
}
else if(document.title == 'Log Out'){
  logOut();
}