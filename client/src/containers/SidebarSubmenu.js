import { NavLink, useLocation } from 'react-router-dom';
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';
import { useEffect, useState } from 'react';

function SidebarSubmenu({ submenu, name, icon, expandedSubmenu, setExpandedSubmenu }) {
    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        setIsExpanded(expandedSubmenu === name);
    }, [expandedSubmenu, name]);

    const handleToggleExpand = () => {
        setIsExpanded(!isExpanded);
        if (!isExpanded) {
            setExpandedSubmenu(name);
        } else {
            setExpandedSubmenu(null);
        }
    };

    const stopPropagation = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="flex flex-col ">
            <div className="w-full text-xs block" onClick={handleToggleExpand}>
                {icon} {name}
                <ChevronDownIcon
                    className={`w-5 h-5 mt-1 float-right delay-400 duration-500 transition-all ${
                        isExpanded ? 'rotate-180' : ''
                    }`}
                />
            </div>
            <div className={`w-full duration-300 transition-all ${isExpanded ? '' : 'hidden'}`}>
                <ul className="menu menu-compact text-xs">
                    {submenu.map((m, k) => (
                        <li key={k}>
                            <NavLink
                            className={({ isActive }) => isActive ? 'font-semibold bg-base-200' : 'font-normal'}
                            to={m.path} onClick={stopPropagation}>
                                {m.icon} {m.name}
                                {location.pathname === m.path && (
                                    <span
                                        className="absolute mt-1 mb-1 inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary"
                                        aria-hidden="true"
                                    ></span>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default SidebarSubmenu;
