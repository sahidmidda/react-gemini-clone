function NoMessages() {
    return (
        <div className="flex flex-col gap-8 justify-center text-center text-white mt-[50px]">
            <h1 className='text-2xl tracking-normal' style={{
                fontFamily: "monospace"
            }}>
                Start your personalised chat with Phoenix right away by typing in the below box
            </h1>
            <h3 className='text-md tracking-normal' style={{
                fontFamily: "monospace"
            }}>
                Note: This app is currently in dev mode so it may produce unexpected answers
            </h3>
        </div>
    )
}

export default NoMessages