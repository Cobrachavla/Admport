import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContext';
import styles from './styles.module.css';
import { LoginIcon } from '@heroicons/react/outline';

const Signin = () => {
  const { currentUser, login, setCurrentUser, setIsSubmitting, loggedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });

      if (response.data.success) {
        // Assuming `setCurrentUser` is a function that stores user data in the context
        setCurrentUser(response.data.user);
        login(response.data.user);
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    }

    setIsSubmitting(false);
  };

  const navigate = useNavigate();

  useEffect(() => {
    loggedIn && navigate('/');
  }, [loggedIn]);

  return (
    <div className={styles.formGroupContainer}>
      <div className={styles.formGroup}>
        <div>
          <h2 className={styles.title}>Login</h2>
        </div>
        <form autoComplete="off" onSubmit={handleSignIn} className={styles.signInForm}>
          <div className={styles.inputGroup}>
            <div>
              <label className="sr-only">Email</label>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                ref={emailRef}
                className={styles.input}
                placeholder="Email Address"
                required
              />
            </div>
            <div>
              <label className="sr-only">Password</label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                className={styles.input}
                placeholder="Password"
                ref={passwordRef}
              />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.linkBox}>
              <div className={styles.linkDiv}>
                <span>
                  Don't have an account? Sign up{' '}
                  <Link to="/signup" className="text-blue-600 hover:underline">
                    here.
                  </Link>
                </span>
              </div>
            </div>
            <div className="text-center">
              <button type="submit" className={styles.button}>
                <LoginIcon className="my-auto h-5 w-6" aria-hidden="true" />
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
