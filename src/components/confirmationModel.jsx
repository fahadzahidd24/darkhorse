import React from 'react'
import style from './popup.module.css'

const ConfirmationModel = ({ onPressYes, onPressNo }) => {
    return (
        <div className={style.popup}>
            <div className={style.popup_inner}>
                <p className={style.message}>Are you sure?</p>
                <button className='btnConfirm' onClick={onPressYes}>Yes</button>
                <button className='btnConfirm' onClick={onPressNo}>No</button>
            </div>
        </div>
    )
}

export default ConfirmationModel