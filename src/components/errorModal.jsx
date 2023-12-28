import React from 'react'
import style from './popup.module.css'

const ErrorModal = ({ onPressOk, errorMessage }) => {
    return (
        <div className={style.popup}>
            <div className={style.popup_inner}>
                <p className={style.message}>{errorMessage}</p>
                <button className='btnConfirm' onClick={onPressOk}>Ok</button>
            </div>
        </div>
    )
}

export default ErrorModal