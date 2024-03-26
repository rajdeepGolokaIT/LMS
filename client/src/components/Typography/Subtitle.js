 function Subtitle({styleClass, children}){
    return(
        <div className={`text-base font-semibold ${styleClass}`}>{children}</div>
    )
}

export default Subtitle