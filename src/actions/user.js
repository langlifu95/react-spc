import * as firebase from 'firebase';

export const login = () => (dispatch) => {
  let provider = new firebase.auth.TwitterAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
    // You can use these server side with your app's credentials to access the Twitter API.
    // var token = result.credential.accessToken;
    // var secret = result.credential.secret;
    // The signed-in user info.
    var user = result.user;
    
    // our user is created and authenticated, now lets save them to the db
    const uid = user.uid
    const timestamp = Math.round(new Date() / 1)
    let newUserRef = firebase.database().ref().child(`users/${uid}`)

    newUserRef.once('value', function(snapshot) { // take a look at the ref via a snapshot
      var exists = (snapshot.val() !== null) // if the snapshot doesn't exist, it means we haven't created this user in the db yet
      if (!exists) { // if the user doesn't exist
        let userData = { // set the user's data
          uid: uid,
          created: timestamp,
          displayName: user.displayName,
          photoURL: user.photoURL,
          frequencies: []
        }

        newUserRef.set(userData, function(err){ // and then write that data to the db
          console.log(err)
        });
      }
    })
    
    // ...
  }).catch(function(error) {
    // Handle Errors here.
    // var errorCode = error.code;
    // var errorMessage = error.message;
    // The email of the user's account used.
    // var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    // var credential = error.credential;
    // ...
  });
}

export const setUser = () => (dispatch) => {
	firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('user model is: ', user)
      dispatch({
				type: 'SET_USER',
				user
			})
    } else {
      console.log('not a user')
    }
  });
}

export const signOut = () => (dispatch) => {
  firebase.auth().signOut().then(function() {
    // sign out successful
    window.location.href = '/' // refresh the page
  }, function(error) {
    // error on signout
  })
}