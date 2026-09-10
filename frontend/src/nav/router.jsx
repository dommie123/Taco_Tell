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
        element: <AddEmployee onEmployeeCreated={(employee) => { console.log(`Employee ${employee.first_name} ${employee.last_name}, ID: ${employee.employee_id} Phone Number: ${employee.phone} created!`)}} />
    }
]);

export default function Router({children}) {
    return (
        <RouterProvider router={router}>
            {children}
        </RouterProvider>
    )
}