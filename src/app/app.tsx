"use client";
import React from 'react';
import { Provider } from 'react-redux';
import { AppStore, makeStore } from '../lib/redux/store';

const App = ({ children }: { children: React.ReactNode }) => {
    const store: AppStore = makeStore();

    return (
        <Provider store={store}>
            <div className='h-[calc(100vh-80px)] flex'>
                {children}
            </div>
        </Provider>
    );
}

export default App;

