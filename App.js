import React, {useState, useEffect} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';

const App = () => {
  const [user, setUser] = useState(null);

  async function onFacebookButtonPress() {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    return auth().signInWithCredential(facebookCredential);
  }

  const onAuthStateChanged = async userAuth => {
    if (!userAuth) {
      return;
    }
    if (userAuth) {
      console.log(userAuth);
      setUser(userAuth);
    }

    return () => userReference();
  };
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return () => {
      subscriber;
    };
  }, []);

  const signOut = async () => {
    auth().signOut();

    setUser(null);

    return () => userReference();
  };

  return (
    <SafeAreaView style={{alignItems: 'center', flex: 1, marginTop: 100}}>
      <View style={{margin: 10}}>
        <Text>FaceBook Sign In Tutorial</Text>
      </View>

      <View style={{margin: 10}}>
        {user === null && (
         <TouchableOpacity onPress={onFacebookButtonPress} style={{alignItems: 'center'}}>
         <Text>Login With FaceBook</Text>
       </TouchableOpacity>
        )}
      </View>
      {user !== null && (
        <View style={{margin: 10}}>
          <Text style={{margin: 10}}>{user.displayName}</Text>
          <TouchableOpacity onPress={signOut} style={{alignItems: 'center'}}>
            <Text>Sign Out</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default App;
