'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export function ProgressProviders({ children }: { children: React.ReactNode }){
    return (
        <>
            <ProgressBar
                height="4px"
                color="#00BCD4"
                options={{ showSpinner: false }}
                shallowRouting
            />
            {children}
        </>
    );
};