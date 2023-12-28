import React, { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import style from './popup.module.css';

const ColorPicker = ({ color, setColor, onClose }) => {
  const colorPickerRef = useRef(null);

  const handleClickOutside = (event) => {
    if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
      // Clicked outside the color picker, so close it
      onClose();
    }
  };

  useEffect(() => {
    // Attach the event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutside);
    
    // Detach the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [colorPickerRef]);

  return (
    <div className={style.popup}>
      <div ref={colorPickerRef} className={style.popup_inner}>
        <HexColorPicker color={color} onChange={setColor} />
      </div>
    </div>
  );
};

export default ColorPicker;
