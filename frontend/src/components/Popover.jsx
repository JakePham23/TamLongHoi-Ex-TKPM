import React from "react";
const Popover = ({ onClick, variants }) => {
    return (
        <div className="OptionLan">
            <div className="Lan">
                {Object.entries(variants).map(([langCode, langLabel]) => (
                    <button key={langCode} onClick={() => onClick(langCode)}>
                        {langLabel}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Popover;
