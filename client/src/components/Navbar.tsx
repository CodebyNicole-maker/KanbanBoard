import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import auth from '../utils/auth';

const Navbar = () => {
	const [loginCheck, setLoginCheck] = useState(false);

	useEffect(() => {
		const checkLogin = () => {
			if (auth.loggedIn()) {
				setLoginCheck(true);
			} else {
				setLoginCheck(false);
			}
		};

		checkLogin(); // Call the function once on mount
	}, []); // ✅ Runs only on component mount

	return (
		<div className='nav'>
			<div className='nav-title'>
				<Link to='/'><h2>Krazy Kanban Board</h2></Link>
			</div>
			<ul>
				{
					!loginCheck ? (
						<li className='nav-item'>
							<button type='button'>
								<Link to='/login'>Login</Link>
							</button>
						</li>
					) : (
						<>
							<li className='nav-item'>
								<button type='button' id='create-ticket-link'>
									<Link to='/create'>New Ticket</Link>
								</button>
							</li>
							<li className='nav-item'>
								<button type='button' onClick={() => {
									auth.logout();
									setLoginCheck(false); // Ensure UI updates after logout
								}}>Logout</button>
							</li>
						</>
					)
				}
			</ul>
		</div>
	);
};

export default Navbar;
