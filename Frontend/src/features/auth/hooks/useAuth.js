import { useDispatch } from 'react-redux';
import { setError, setLoading, setUser } from '../auth.slice';
import { getCurrentUser, login, logout, signup } from '../services/auth.api';

const useAuth = () => {
  const dispatch = useDispatch();

  const loginUser = async (credential, password) => {
    dispatch(setLoading(true));
    try {
      const data = await login(credential, password);
      dispatch(setUser(data.user));
      dispatch(setError(null));
      return true
    } catch (error) {
      dispatch(setError(error.message || 'Login failed'));
      return false
    } finally {
      dispatch(setLoading(false));
    }
  };

  const signupUser = async (fullName, email, phone, password, confirmPassword, role = 'buyer') => {
    dispatch(setLoading(true));
    try {
      const response = await signup(fullName, email, phone, password, confirmPassword, role);
      dispatch(setError(null));
      return true;
    } catch (error) {
      dispatch(setError(error.message || 'Signup failed'));
      return false
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchCurrentUser = async () => {
    dispatch(setLoading(true));
    try {
      const data = await getCurrentUser();
      dispatch(setUser(data.user));
      dispatch(setError(null));
    } catch (error) {
      dispatch(setUser(null));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
      dispatch(setUser(null));
    } catch (error) {
      throw new Error(error.message || 'Logout failed');
    }
  };

  return {
    loginUser,
    signupUser,
    fetchCurrentUser,
    logoutUser
  };
};

export default useAuth;