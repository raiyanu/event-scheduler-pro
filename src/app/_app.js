import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import store from '../redux/store';  // assuming your redux store is in redux/store.js
import { authStateChangedd } from './redux/slice/userSlice';

function MyApp({ Component, pageProps }) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(authStateChanged());
    }, [dispatch]);
    console.log("Hey there")

    return (
        <Provider store={store}>
            <Component {...pageProps} />
        </Provider>
    );
}

export default MyApp;
