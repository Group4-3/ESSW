const Navbar = () => {
    return (
<nav className="navbar">
    <h3>Ephermeral Secret Sharing Website</h3>
    <div className="links"> 
       <a href="/">Home</a>
       <a href="/viewsecret" style={{
        color: "white",
        backgroundColor: '#f1356d',
        borderRadius: '8px'
       }}>View Secret</a>
    </div>
</nav>
    );
}

export default Navbar;