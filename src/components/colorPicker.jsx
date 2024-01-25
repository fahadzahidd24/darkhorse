import React, { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import style from './popup.module.css';

const ColorPicker = ({ color, setColor, onClose, line, recentColors, onSelectColor }) => {
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
        {line && <h6 className='text-white'>After selecting color, click on respective lines to change their color</h6>}
        <HexColorPicker color={color} onChange={setColor} />
        {(recentColors && recentColors.length > 0) &&
          <div className='d-flex justify-content-between align-items-between'>
            {recentColors.map((color, index) =>
            (<button style={{ backgroundColor: color, border: 'none', borderRadius: "10%", width: 50, height: 40, marginLeft: 10, marginRight: 10 }} onClick={() => onSelectColor(color)}>
            </button>
            )
            )}
          </div>
        }
      </div>
    </div>
  );
};

export default ColorPicker;
