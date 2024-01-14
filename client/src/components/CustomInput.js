import React from "react";
import { ChatAutoComplete, useMessageInputContext } from "stream-chat-react";

// Stream Chat ile Mesaj Gönderme
function CustomInput() {
  const { handleSubmit } = useMessageInputContext();
  return (
    <div className="str-chat__input-flat str-chat__input-flat--send-button-active">
      <div className="str-chat__input-flat-wrapper">
        <div className="str-chat__input-flat--textarea-wrapper">
        <ChatAutoComplete/>
        </div>
        <button className="glow-on-hover" onClick={handleSubmit}> Mesaj Gönder</button>
      </div>
    </div>
  );
}

export default CustomInput;
