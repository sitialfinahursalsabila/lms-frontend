import React from 'react';
import { FaChartBar, FaUser, FaDesktop, FaUserLock } from "react-icons/fa";
import { BsMortarboardFill } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/Auth';

const UserSidebar = () => {
    const { logout } = useContext(AuthContext);

    return (
        <div className='card border-0 shadow-lg'>
            <div className='card-body p-4'>
                <ul className="list-unstyled mb-0">
                    <li className='d-flex align-items-center mb-3'>
                        <Link to="/account/dashboard" className="text-decoration-none text-dark">
                            <FaChartBar size={16} className='me-2' /> Dashboard
                        </Link>
                    </li>

                    <li className='d-flex align-items-center mb-3'>
                        <Link to="/account/profile" className="text-decoration-none text-dark">
                            <FaUser size={16} className='me-2' /> Profile
                        </Link>
                    </li>

                    <li className='d-flex align-items-center mb-3'>
                        <Link to="/account/my-learning" className="text-decoration-none text-dark">
                            <BsMortarboardFill size={16} className='me-2' /> My Learning
                        </Link>
                    </li>

                    <li className='d-flex align-items-center mb-3'>
                        <Link to="/account/my-courses" className="text-decoration-none text-dark">
                            <FaDesktop size={16} className='me-2' /> My Courses
                        </Link>
                    </li>

                    <li className='d-flex align-items-center mb-3'>
                        <Link to="/account/change-password" className="text-decoration-none text-dark">
                            <FaUserLock size={16} className='me-2' /> Change Password
                        </Link>
                    </li>

                    <li>
                        <Link onClick={logout} className='text-danger'><MdLogout size={16} className='me-2' />Logout</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default UserSidebar;