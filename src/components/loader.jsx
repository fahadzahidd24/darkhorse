import React from 'react'
import { Audio } from 'react-loader-spinner'
import style from './loader.module.css'
const Loader = () => {
    return (
        <Audio
            height="100"
            width="100"
            color="#ffffff"
            ariaLabel="audio-loading"
            // wrapperStyle={style.loader}
            wrapperClass={style.loader}
            visible={true}
        />
    )
}

export default Loader