import { useState } from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import SidebarSubmenu from './SidebarSubmenu';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import routes from '../routes/sidebar';

function LeftSidebar() {
    const location = useLocation();
    const [expandedSubmenu, setExpandedSubmenu] = useState(null);
    const [isActive, setIsActive] = useState(false);

    const handleToggleExpand = (submenuName) => {
        setExpandedSubmenu(submenuName === expandedSubmenu ? null : submenuName);
    };

    const close = () => {
        document.getElementById('left-sidebar-drawer').click();
    };

    return (
        <div className="drawer-side z-30">
            <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
            <ul className="menu pt-2 w-64 bg-base-100 min-h-full text-base-content">
                <button className="btn btn-ghost bg-base-300 btn-circle z-50 top-0 right-0 mt-4 mr-2 absolute lg:hidden" onClick={close}>
                    <XMarkIcon className="h-5 inline-block w-5" />
                </button>
                <li className="mb-2 font-semibold text-xl">
                    <Link to="/app/dashboard">
                        <img className="mask w-16" src="/main-logo.jpg" alt="DashWind Logo" />Celltone 21
                    </Link>
                </li>
                {routes.map((route, index) => (
                    <li className="text-xs" key={index} onClick={() => handleToggleExpand(route.name)}>
                        {route.submenu ? (
                            <SidebarSubmenu
                                {...route}
                                expandedSubmenu={expandedSubmenu}
                                setExpandedSubmenu={handleToggleExpand}
                            />
                        ) : (
                            <NavLink
                                end
                                to={route.path}
                                onClick={() => setIsActive(true)}
                                className={({ isActive }) =>
                                    `${isActive === true ? `font-semibold bg-base-200` : 'font-normal'}`
                                }
                            >
                                {route.icon} {route.name}
                                {location.pathname === route.path && (
                                    <span
                                        className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary"
                                        aria-hidden="true"
                                    ></span>
                                )}
                            </NavLink>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LeftSidebar;
