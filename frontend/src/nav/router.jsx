import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AddEmployee, Employees } from '../components/feature';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Employees />
    },
    {
        path: "/add_employee",
        element: <AddEmployee onEmployeeCreated={() => {}} />
    }
]);

export default function Router({children}) {
    return (
        <RouterProvider router={router}>
            {children}
        </RouterProvider>
    )
}