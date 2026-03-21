import './navbar.scss'
import logo from '../../assets/logo.png'

export const Navbar = () => {
    return (
        <header>
            <nav>
                <div className='logo'>
                    <img src={logo}></img>
                </div>
            </nav>
        </header>
    );
}