// import React, { Fragment } from "react";
// // import { useSelector } from "react-redux";
// import { Navigate, Route } from "react-router-dom";

// const ProtectedRoute = ({ isAdmin,user,loading, isAuthenticated, component: Component, ...rest }) => {
//   // const { loading, isAuthenticated, user } = useSelector((state) => state.user); 

//   return (
//     <Fragment>
//       {loading === false && (
//         <Route
//           {...rest}
//           render={(props) => {
//             if (isAuthenticated === false) {
//               return <Navigate to="/login" />;
//             }

//             if (isAdmin === true && user.role !== "admin") {
//               return <Navigate to="/login" />;
//             }

//             return <Component {...props} />;
//           }}
//         />
       

//       )}
//     </Fragment>

//   );
// };

// export default ProtectedRoute;


import React, { Fragment } from 'react';
import { Route, Outlet, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAdmin, user, loading, isAuthenticated, element: Element, ...rest }) => {

  return (
    <Fragment>
      {loading === false && (
        <Route
          {...rest}
          element={
            isAuthenticated ? (
              isAdmin === true && user.role !== 'admin' ? (
                // Redirect to login if not admin
                () => <Navigate to="/login" replace />
              ) : (
                // Render the component
                <Element />
              )
            ) : (
              // Redirect to login if not authenticated
              () => <Navigate to="/login" replace />
            )
          }
        />
      )}
      <Outlet />
    </Fragment>
  );
};

export default ProtectedRoute;
