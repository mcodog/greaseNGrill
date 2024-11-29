import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import { firebaseLogin, firebaseRegister, signInWithGoogle } from '../auth/auth';
import axios from 'axios'

// preview-start
const providers = [{ id: 'credentials', name: 'Email and Password' }, { id: 'google', name: 'Google' },];
// preview-end

const googleSignIn = async () => {
  try {
    const user = await signInWithGoogle()
    const token = await user.getIdToken();
    const res = await axios.post("http://localhost:8000/api/auth/google", { token });
    setTimeout(() => {
      window.location.href = "/"
    }, 1000);
    if (res.response.data.message == "User not found") {
      alert("invalid")
    }
  } catch (e) {
    console.log(e)
  }
};

const signIn = async (provider, formData) => {
  if (provider.id === "google") {
    return googleSignIn();
  }

  try {
    console.log(formData.get('email'))
    console.log(formData.get('password'))
    await loginAttempt(formData.get('email'), formData.get('password'))
    console.log("Logging in...")
    window.location.href = "/"
  } catch (e) {
    // toast.error("Error: Please check your credentials.")
    console.log(e)
  }
};

const loginAttempt = async (email, passwd) => {
  const user = await firebaseLogin(email, passwd)
  const token = await user.getIdToken();
  const res = await axios.post("http://localhost:8000/api/auth", { token });


  setTimeout(() => {
    if (res.statusText == 'OK') {
      window.location.href = "/"
    }
  }, 2000);

}

export default function CredentialsSignInPage() {
  const theme = useTheme();
  return (
    // preview-start
    <AppProvider theme={theme}>
      <SignInPage signIn={signIn} providers={providers} />
    </AppProvider>
    // preview-end
  );
}
