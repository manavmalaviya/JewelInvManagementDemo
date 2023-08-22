// import React from "react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import bcrypt from 'bcryptjs'
import { useCookies } from "react-cookie";

const RouterComponent = (props) => {

    const [cookies] = useCookies(['isAuthenticated', "user_data"]);
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        const refresh = () => {

            if (cookies.isAuthenticated !== undefined) {
                bcrypt.compare('true', cookies.isAuthenticated)
                    .then((isAuth) => {
                        if (isAuth) {
                            return bcrypt.compare('true', cookies.user_data)
                                .then((isAdmin) => {
                                    console.log(isAdmin);
                                    if (isAdmin) {
                                        props.setIsAdmin(true);
                                    } else {
                                        props.setIsAdmin(false);
                                    }
                                    props.setIsAuthenticated(true);
                                    const pathname = location.pathname;
                                    navigate(`${pathname}`);

                                });
                        }
                        else {
                            return navigate('/login');
                        }
                    })
                    .catch((error) => {
                        console.error('Error comparing:', error);
                    });
            } else {
                navigate('/login');
            }

        };
        refresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}

export default RouterComponent