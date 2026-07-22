import React from 'react';
import { Outlet } from 'react-router';

import DialogOversikt from './dialogliste/DialogOversikt';
import { EventHandler } from './EventHandler';
import StatusAdvarsel from './statusAdvarsel/StatusAdvarsel';
import DialogHeaderFeil from './dialog/DialogHeaderFeil';

const AppBody = () => {
    return (
        <div className="flex flex-1 flex-col">
            <StatusAdvarsel />
            <div className="flex flex-1 max-h-full">
                <DialogOversikt />
                <div className="flex flex-1 border border-solid border-ax-bg-neutral-moderate-pressed flex-col">
                    <DialogHeaderFeil />
                    <Outlet />
                </div>
                <EventHandler />
            </div>
        </div>
    );
};

export default AppBody;
