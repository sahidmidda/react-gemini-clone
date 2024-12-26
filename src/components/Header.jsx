function Header() {
    return (
        <header className="bg-blue-900 flex flex-row w-full justify-center gap-4 text-white p-2">
            <h1 className="text-center text-4xl" style={{
                fontFamily: "Rancho",
            }}>
                Phoenix AI
            </h1>
            <img src="../src/assets/phoenixAiLogo.png" alt="Phoenix Logo" className='w-[40px] h-[40px] rounded-full' />
        </header>
    )
}

export default Header