import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';

const App = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const [isSignUp, setIsSignUp] = useState(false);

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

  const signUp = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        alert('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          alert('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          alert('That email address is invalid!');
        }

        console.error(error);
      });
  };

  const signIn = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        alert('User Signed In');
      })
      .catch(error => {
        console.error(error);
      });
  };

  const signOut = async () => {
    auth().signOut();

    setUser(null);

    return () => userReference();
  };

  return (
    <SafeAreaView style={{alignItems: 'center', flex: 1, marginTop: 100}}>
      <View style={{margin: 10}}>
        <Text>Email Sign In Tutorial</Text>
      </View>

      <View style={{margin: 10}}>
        {user === null && (
          <>
            <TextInput
              value={email}
              onChangeText={e => setEmail(e)}
              placeholder="Email"
              style={{
                borderWidth: 1,
                margin: 10,
                padding: 10,
              }}></TextInput>
            <TextInput
              value={password}
              onChangeText={e => setPassword(e)}
              placeholder="password"
              style={{borderWidth: 1, margin: 10, padding: 10}}></TextInput>
            {isSignUp ? (
              <>
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    margin: 10,
                    padding: 10,
                    alignItems: 'center',
                  }}
                  onPress={() => signUp()}>
                  <Text>Sign up</Text>
                </TouchableOpacity>
                <Text onPress={() => setIsSignUp(false)}>
                  Already have an account? Sign In
                </Text>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    margin: 10,
                    padding: 10,
                    alignItems: 'center',
                  }}
                  onPress={() => signIn()}>
                  <Text>Sign in</Text>
                </TouchableOpacity>
                <Text onPress={() => setIsSignUp(true)}>
                  Already have an account? Sign In
                </Text>
              </>
            )}
          </>
        )}
      </View>
      {user !== null && (
        <View style={{margin: 10}}>
          <Text style={{margin: 10}}>{user.email}</Text>
          <TouchableOpacity onPress={signOut} style={{alignItems: 'center'}}>
            <Text>Sign Out</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default App;
