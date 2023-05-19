import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import React, { useState, useEffect } from 'react';

function Layout() {
	return (
		<div className="py-5 px-0 flex flex-col min-h-screen">
			<Header />
			<Outlet />
		</div>
	
	);
}





export default Layout;