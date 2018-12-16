(function() {
  "use strict";

  // MODULE GLOBAL VARIABLES, CONSTANTS, AND HELPER FUNCTIONS CAN BE PLACED
  // HERE
  const API_URL = ""; // it's good to factor out your url base as a constant
  const WELCOME = "Welcome to Xiulong's webpage";
  const INT_TYPE = 200;
  const INT_DEL = 100;
  const ADDFAV = "addfav.php";
  let timer = null;
  /**
   *  Add a function that will be called when the window is loaded.
   */
  window.addEventListener("load", initialize);

  /**
   *  CHANGE: Describe what your initialize function does here.
   */
  function initialize() {
    // THIS IS THE CODE THAT WILL BE EXECUTED ONCE WEBPAGE LOADS
    initialView();
  }

  function initialView() {
    $("main-view").classList.add("hidden");
    timer = setInterval(type, INT_TYPE);
    $("change").addEventListener("click", changeView);
  }

  function changeView() {
    $("main-view").classList.toggle("hidden");
    clearInterval(timer);
    $("welcome").innerText = "";
    $("initial").classList.toggle("hidden");
    qs("header").classList.remove("hidden");
    requestFav();
  }

  function type() {
    let len = WELCOME.length;
    let p = $("welcome").innerText;
    let index =  p.length;
    if (index < len) {
      if (WELCOME[index] == " ") {
        $("welcome").innerText = p + " " + WELCOME[index + 1];
      } else {
        $("welcome").innerText = p + WELCOME[index];
      }
    } else {
      clearInterval(timer);
      setTimeout(()=>{wait(1);}, 1000);
    }
  }

  function wait(state) {
    if (state == 1) {
          timer = setInterval(del, INT_DEL);
    } else {
         timer = setInterval(type, INT_TYPE);
    }

  }

  function del() {
    let len = WELCOME.length;
    let p = $("welcome").innerText;
    let index =  p.length - 1;
    if (index > 1) {
      $("welcome").innerText = p.substr(0, index);
    } else {
      $("welcome").innerText = "";
      //timer = null;
      clearInterval(timer);
      setTimeout(()=>{wait(0);}, 1000);
    }
  }

  function requestFav() {
    let url = ADDFAV + "?mode=song";
    fetch(url, {mode: "cors"})
        .then(checkStatus)
        .then(JSON.parse)
        .then(populateSong)
        .catch(console.log);
    url = ADDFAV + "?mode=food";
    fetch(url, {mode: "cors"})
        .then(checkStatus)
        .then(JSON.parse)
        .then(populateFood)
        .catch(console.log);
  }

  function populateSong(songs) {
    songs = JSON.parse(JSON.stringify(songs).replace(/[\u200B-\u200D\uFEFF]/g,''));
    for (let i = 0; i < songs.length; i ++) {
      let div = document.createElement("div");
      let h4 = document.createElement("h4");
      h4.innerText = songs[i]["author"] + ": " + songs[i]["name"];
      div.appendChild(h4);
      let a = document.createElement("a");
      a.href = songs[i].url;
      a.target = "_blank";
      let img = document.createElement("img");
      img.src = songs[i].images;
      img.alt = songs[i]["author"] + ": " + songs[i]["name"];
      img.classList.add("fav");
      a.appendChild(img);
      div.appendChild(a);
      $("songlist").appendChild(div);
    }
  }

  function populateFood(food) {
    let foods = JSON.parse(JSON.stringify(food).replace(/[\u200B-\u200D\uFEFF]/g,''));
    for (let i = 0; i < foods.length; i ++) {
      let div = document.createElement("div");
      let img = document.createElement("img");
      img.src = foods[i].images;
      img.alt = foods[i]["name"];
      img.classList.add("fav");
      div.appendChild(img);
      let h4 = document.createElement("h4");
      h4.innerText = foods[i]["name"];
      div.appendChild(h4);
      $("foodlist").appendChild(div);
      let p = document.createElement("p");
      p.innerText = foods[i].recipe;
      div.appendChild(p);
    }
  }

  /**
   * Step 1: Write a function to "fetch" data from a URL (possibly with query/value pairs)
   */
  function makeRequest() {
    let url = URL_BASE; // if no params needed in request url
    //let url = URL_BASE + "?query0=value0&query1=value1..."; // two or more query/value pairs, joined by &
    fetch(url, {mode : "cors"})
      .then(checkStatus)
    //.then(JSON.parse)       // uncomment if response returns JSON format instead of text
      .then(successFunction)
      .catch(console.log);
  }

  /**
   * Step 2: Write a function to do something with the response (if successful)
   */
  function successFunction(responseData) {
    // responseData is string if you didn't include JSON.parse in fetch call chain, else JSON object
    // now play with your responseData! (build DOM, display messages, etc.)
  }

  /* ------------------------------ Helper Functions  ------------------------------ */
  // Note: You may use these in your code, but do remember that your code should not have
  // any functions defined that are unused.

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID
   * @returns {object} DOM object associated with id.
   */
  function $(id) {
    return document.getElementById(id);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} query - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(query) {
    return document.querySelector(query);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} query - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @returns {object} - valid result text if response was successful, otherwise rejected
   *                     Promise result
   */
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300 || response.status == 0) {
      return response.text();
    } else {
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }

})();
