import React, {useState, useEffect} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import auth from '@react-native-firebase/auth';

import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';


const App = () => {
  const [user, setUser] = useState(null);

  async function onAppleButtonPress() {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    if (!appleAuthRequestResponse.identityToken) {
      throw 'Apple Sign-In failed - no identify token returned';
    }

    const {identityToken, nonce} = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );

    return auth().signInWithCredential(appleCredential);
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
        <Text>Apple Sign In Tutorial</Text>
      </View>

      <View style={{margin: 10}}>
        {user === null && (
          <AppleButton
            buttonStyle={AppleButton.Style.BLACK}
            buttonType={AppleButton.Type.SIGN_IN}
            style={{width: 312, height: 48}}
            onPress={() =>
              onAppleButtonPress().then(() =>
                console.log('Apple sign-in complete!'),
              )
            }
          />
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
